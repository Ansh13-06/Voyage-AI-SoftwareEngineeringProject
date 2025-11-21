import { createContext, useContext, useState, useEffect } from "react";
import { sendChatMessage, generateTripDetails } from "../service/ChatBotAI";
import { getWeather, getWeatherRecommendation } from "../service/WeatherAPI";
import { db } from "../service/firebaseConfig";
import {
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [userTripsString, setUserTripsString] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const userEmail = user?.email;

  // 1️⃣ Fetch Trips
  useEffect(() => {
    if (!userEmail) return;
    const fetchTrips = async () => {
      try {
        const q = query(
          collection(db, "AITrips"),
          where("userEmail", "==", userEmail)
        );
        const querySnapshot = await getDocs(q);
        const tripsData = querySnapshot.docs
          .map((doc) => {
            const data = doc.data();
            const loc = data?.userSelection?.location || "Unknown";
            const days = data?.userSelection?.noOfDays || "Unknown";
            return `- Trip to ${loc} for ${days} days.`;
          })
          .join("\n");
        setUserTripsString(tripsData);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };
    fetchTrips();
  }, [userEmail]);

  // 2️⃣ Load Chat History
  useEffect(() => {
    if (!userEmail) return;
    const docRef = doc(db, "UserChats", userEmail);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setMessages(docSnap.data().messages || []);
      } else {
        setDoc(docRef, { messages: [] });
      }
    });
    return () => unsubscribe();
  }, [userEmail]);

  // 3️⃣ Send Message (With Weather & Smart Generation)
  const sendMessage = async (text) => {
    if (!text.trim()) return;

    if (!userEmail) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Please log in to chat with Orbit! 🔒" },
      ]);
      return;
    }

    setIsLoading(true);
    const userMsg = {
      sender: "user",
      text: text,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const chatDocRef = doc(db, "UserChats", userEmail);
      await updateDoc(chatDocRef, { messages: arrayUnion(userMsg) });

      // A. Get AI Response
      let replyText = await sendChatMessage(text, messages, userTripsString);

      // B. Check for JSON Trip Plan
      const jsonMatch = replyText.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        try {
          const parsedData = JSON.parse(jsonMatch[0]);

          if (parsedData.isTripPlan) {
            const location = parsedData.userSelection.location;

            // C. Get Weather
            const weather = await getWeather(location);
            const weatherVerdict = getWeatherRecommendation(weather);
            const weatherString = weather
              ? `\n\n**🌤 Current Weather in ${location}:** ${weather.current.temp_c}°C, ${weather.current.condition.text}.\n${weatherVerdict}`
              : "";

            // D. Generate Trip
            const fullTripData = await generateTripDetails(
              parsedData.userSelection
            );

            if (fullTripData) {
              const tripId = Date.now().toString();

              await setDoc(doc(db, "AITrips", tripId), {
                userSelection: parsedData.userSelection,
                tripData: fullTripData,
                userEmail: userEmail,
                id: tripId,
                weatherSnapshot: weather || null,
              });

              replyText = `🎉 **Success!** I've planned your trip to **${location}**. \n\nCheck your dashboard or [Click Here](/view-trip/${tripId}) to view the itinerary! ✈️${weatherString}`;
            } else {
              replyText =
                "I understood the plan, but I faced a technical glitch creating the itinerary. Please try again!";
            }
          }
        } catch (e) {
          console.error("JSON Processing Error:", e);
          replyText =
            "I'm having trouble creating that trip. Could you clarify the location and duration?";
        }
      }

      const botMsg = {
        sender: "bot",
        text: replyText,
        createdAt: new Date().toISOString(),
      };
      await updateDoc(chatDocRef, { messages: arrayUnion(botMsg) });
    } catch (error) {
      console.error("Message Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    if (!userEmail) return;
    await setDoc(doc(db, "UserChats", userEmail), { messages: [] });
    setMessages([]);
  };

  return (
    <ChatContext.Provider
      value={{ messages, sendMessage, clearChat, isLoading }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
