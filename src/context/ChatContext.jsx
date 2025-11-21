// import { createContext, useContext, useState, useEffect } from "react";
// import { sendChatMessage, generateTripDetails } from "../service/ChatBotAI";
// import { getWeather, getWeatherRecommendation } from "../service/WeatherApi"; // 🔥 1. Import Weather Service
// import { db } from "../service/firebaseConfig";
// import {
//   doc,
//   setDoc,
//   updateDoc,
//   arrayUnion,
//   onSnapshot,
//   collection,
//   query,
//   where,
//   getDocs,
// } from "firebase/firestore";

// const ChatContext = createContext();

// export const ChatProvider = ({ children }) => {
//   const [messages, setMessages] = useState([]);
//   const [userTripsString, setUserTripsString] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   // Get current user
//   const user = JSON.parse(localStorage.getItem("user"));
//   const userEmail = user?.email;

//   // ---------------------------------------------------------
//   // 1️⃣ Fetch Trips (Context for AI)
//   // ---------------------------------------------------------
//   useEffect(() => {
//     if (!userEmail) return;

//     const fetchTrips = async () => {
//       try {
//         const q = query(
//           collection(db, "AITrips"),
//           where("userEmail", "==", userEmail)
//         );
//         const querySnapshot = await getDocs(q);

//         const tripsData = querySnapshot.docs
//           .map((doc) => {
//             const data = doc.data();
//             const loc = data?.userSelection?.location || "Unknown";
//             const days = data?.userSelection?.noOfDays || "Unknown";
//             return `- Trip to ${loc} for ${days} days.`;
//           })
//           .join("\n");

//         setUserTripsString(tripsData);
//       } catch (error) {
//         console.error("Error fetching trips:", error);
//       }
//     };

//     fetchTrips();
//   }, [userEmail]);

//   // ---------------------------------------------------------
//   // 2️⃣ Load Chat History
//   // ---------------------------------------------------------
//   useEffect(() => {
//     if (!userEmail) return;
//     const docRef = doc(db, "UserChats", userEmail);

//     const unsubscribe = onSnapshot(docRef, (docSnap) => {
//       if (docSnap.exists()) {
//         setMessages(docSnap.data().messages || []);
//       } else {
//         setDoc(docRef, { messages: [] });
//       }
//     });
//     return () => unsubscribe();
//   }, [userEmail]);

//   // ---------------------------------------------------------
//   // 3️⃣ Send Message & Create Trip Logic (WITH WEATHER)
//   // ---------------------------------------------------------
//   const sendMessage = async (text) => {
//     if (!text.trim()) return;

//     // Guard: User must be logged in
//     if (!userEmail) {
//       setMessages((prev) => [
//         ...prev,
//         { sender: "bot", text: "Please log in to chat with Orbit! 🔒" },
//       ]);
//       return;
//     }

//     setIsLoading(true);

//     const userMsg = {
//       sender: "user",
//       text: text,
//       createdAt: new Date().toISOString(),
//     };

//     setMessages((prev) => [...prev, userMsg]);

//     try {
//       const chatDocRef = doc(db, "UserChats", userEmail);
//       await updateDoc(chatDocRef, { messages: arrayUnion(userMsg) });

//       // A. Get Response from Chatbot
//       let replyText = await sendChatMessage(text, messages, userTripsString);

//       // B. Check if Chatbot returned a TRIP JSON
//       const jsonMatch = replyText.match(/\{[\s\S]*\}/);

//       if (jsonMatch) {
//         try {
//           const parsedData = JSON.parse(jsonMatch[0]);

//           if (parsedData.isTripPlan) {
//             const location = parsedData.userSelection.location;

//             // 🔥 2. GET WEATHER DATA BEFORE GENERATING TRIP
//             const weather = await getWeather(location);
//             const weatherVerdict = getWeatherRecommendation(weather);

//             // Prepare the weather text to append to the bot's reply
//             const weatherString = weather
//               ? `\n\n**🌤 Current Weather in ${location}:** ${weather.current.temp_c}°C, ${weather.current.condition.text}.\n${weatherVerdict}`
//               : "";

//             // C. CALL THE GENERATION FUNCTION
//             const fullTripData = await generateTripDetails(
//               parsedData.userSelection
//             );

//             if (fullTripData) {
//               const tripId = Date.now().toString();

//               // D. Save to Firestore (Matches CreateTrip structure EXACTLY)
//               // 🔥 3. Save weatherSnapshot too
//               await setDoc(doc(db, "AITrips", tripId), {
//                 userSelection: parsedData.userSelection,
//                 tripData: fullTripData,
//                 userEmail: userEmail,
//                 id: tripId,
//                 weatherSnapshot: weather || null, // Optional: store weather at time of creation
//               });

//               // 🔥 4. Add weatherString to the final reply
//               replyText = `🎉 Success! I've generated your trip to **${location}**. \n\nYou can view the full itinerary on your dashboard or [Click Here](/view-trip/${tripId}) to see it now! ✈️${weatherString}`;
//             } else {
//               replyText =
//                 "I understood the plan, but I faced a glitch generating the detailed itinerary. Please try again!";
//             }
//           }
//         } catch (e) {
//           console.error("JSON Parsing/Generation Error:", e);
//           replyText =
//             "I'm having trouble processing that trip request. Could you be more specific about the location and days?";
//         }
//       }

//       // E. Save Bot Reply
//       const botMsg = {
//         sender: "bot",
//         text: replyText,
//         createdAt: new Date().toISOString(),
//       };

//       await updateDoc(chatDocRef, { messages: arrayUnion(botMsg) });
//     } catch (error) {
//       console.error("Message Error:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const clearChat = async () => {
//     if (!userEmail) return;
//     await setDoc(doc(db, "UserChats", userEmail), { messages: [] });
//     setMessages([]);
//   };

//   return (
//     <ChatContext.Provider
//       value={{ messages, sendMessage, clearChat, isLoading }}
//     >
//       {children}
//     </ChatContext.Provider>
//   );
// };

// export const useChat = () => useContext(ChatContext);
import { createContext, useContext, useState, useEffect } from "react";
import { sendChatMessage, generateTripDetails } from "../service/ChatBotAI";
import { getWeather, getWeatherRecommendation } from "../service/WeatherApi";
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
