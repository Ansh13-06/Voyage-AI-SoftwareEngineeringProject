// // 📄 src/service/ChatBotAI.jsx
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { AI_PROMPT } from "@/constants/options";
// import { getChatSession } from "@/service/AIModel";

// const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// const genAI = new GoogleGenerativeAI(API_KEY);

// let chatbotSession = null;

// export const initChatBot = async (history = [], tripsContext = "") => {
//   const systemPrompt = `
//     You are Orbit, an AI Travel Assistant.
    
//     CONTEXT:
//     The user has these past trips in their database: ${tripsContext}

//     🛑 TRIP PLANNING INSTRUCTIONS:
//     To plan a trip, you MANDATORILY need these 4 details. You must Extract them from the user's sentence:
    
//     1. **Location** (City/Place)
//     2. **Duration** (No. of Days) - Extract number (e.g., "2 days" -> "2")
//     3. **Budget** (Map to: Cheap, Moderate, Luxury) 
//        - Examples: "budget friendly"->"Cheap", "standard/mid"->"Moderate", "rich/high"->"Luxury".
//     4. **Traveler** (Map to: Just Me, A Couple, Family, Friends)
//        - Examples: "solo"->"Just Me", "couples/wife/partner"->"A Couple", "with kids"->"Family".

//     🧠 MEMORY & LOGIC:
//     1. Analyze the user's input. **Combine it with previous conversation context.** (e.g., If user previously said "Goa for 2 days" and now says "Moderate", you now have Location, Days, and Budget).
//     2. **IF DETAILS ARE MISSING:** - Ask for the specific missing info politely.
//        - List options for Budget/Traveler to guide the user.
//     3. **IF ALL 4 DETAILS ARE PRESENT (either in this message or combined with history):**
//        - Return a JSON OBJECT with this schema:
//        {
//          "isTripPlan": true,
//          "userSelection": {
//            "location": "City Name",
//            "noOfDays": "Number",
//            "budget": "Cheap" | "Moderate" | "Luxury",
//            "traveler": "Just Me" | "A Couple" | "Family" | "Friends"
//          }
//        }

//     For normal conversation, answer normally with emojis.
//   `;

//   const model = genAI.getGenerativeModel({
//     model: "gemini-2.5-flash-lite", // Switched to 1.5-flash for better instruction following
//     systemInstruction: systemPrompt,
//   });

//   const formattedHistory = history.map((msg) => ({
//     role: msg.sender === "user" ? "user" : "model",
//     parts: [{ text: msg.text }],
//   }));

//   chatbotSession = model.startChat({
//     generationConfig: { temperature: 1.0, maxOutputTokens: 500 },
//     history: formattedHistory,
//   });

//   return chatbotSession;
// };

// export const sendChatMessage = async (
//   message,
//   currentHistory = [],
//   tripsContext = ""
// ) => {
//   try {
//     if (!chatbotSession) {
//       await initChatBot(currentHistory, tripsContext);
//     }
//     const result = await chatbotSession.sendMessage(message);
//     return await result.response.text();
//   } catch (err) {
//     console.error("Chatbot Error:", err);
//     return "I'm having a little trouble connecting right now. 🔌";
//   }
// };

// export const generateTripDetails = async (selection) => {
//   const { location, noOfDays, budget, traveler } = selection;
//   const cleanDays = noOfDays.toString().replace(/\D/g, "");

//   console.log("🚀 Generating Trip via Chatbot for:", {
//     location,
//     cleanDays,
//     budget,
//     traveler,
//   });

//   const FINAL_PROMPT = AI_PROMPT.replace("{location}", location)
//     .replaceAll("{totalDays}", cleanDays)
//     .replace("{traveler}", traveler)
//     .replace("{budget}", budget);

//   try {
//     const session = getChatSession(); // Using the robust session getter
//     const result = await session.sendMessage(FINAL_PROMPT);
//     const responseText = await result.response.text();

//     const jsonMatch = responseText.match(/\{[\s\S]*\}/);
//     if (!jsonMatch) {
//       throw new Error("No JSON found in response");
//     }

//     return JSON.parse(jsonMatch[0]);
//   } catch (error) {
//     console.error("❌ Trip Generation Error:", error);
//     return null;
//   }
// };
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AI_PROMPT } from "@/constants/options";
import { getChatSession } from "@/service/AIModel";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

let chatbotSession = null;

export const initChatBot = async (history = [], tripsContext = "") => {
  const systemPrompt = `
    You are Orbit, an AI Travel Assistant.
    
    CONTEXT:
    The user has these past trips in their database: ${tripsContext}

    🛑 TRIP PLANNING INSTRUCTIONS:
    To plan a trip, you MANDATORILY need these 4 details. You must Extract them from the user's sentence:
    1. **Location** (City/Place)
    2. **Duration** (No. of Days)
    3. **Budget** (Cheap, Moderate, Luxury) 
    4. **Traveler** (Just Me, A Couple, Family, Friends)

    ✈️ FLIGHT SEARCH INSTRUCTIONS:
    If the user asks for "Flights", "Flight tickets", or "How to get to [Location] from [Origin]":
    - You must extract:
      1. **Origin** (Starting City)
      2. **Destination** (Arrival City)
      3. **Date** (Travel Date - if not provided, assume "tomorrow")
    - Return a JSON OBJECT with this schema:
      {
        "isFlightSearch": true,
        "flightDetails": {
          "origin": "City Name",
          "destination": "City Name",
          "date": "Date String"
        }
      }

    🧠 MEMORY & LOGIC:
    1. Analyze the user's input. Combine with previous context.
    2. **IF ALL 4 TRIP DETAILS ARE PRESENT:**
       - Return JSON:
       {
         "isTripPlan": true,
         "userSelection": {
           "location": "City Name",
           "noOfDays": "Number",
           "budget": "Cheap" | "Moderate" | "Luxury",
           "traveler": "Just Me" | "A Couple" | "Family" | "Friends"
         }
       }

    For normal conversation, answer normally with emojis.
  `;

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    systemInstruction: systemPrompt,
  });

  const formattedHistory = history.map((msg) => ({
    role: msg.sender === "user" ? "user" : "model",
    parts: [{ text: msg.text }],
  }));

  chatbotSession = model.startChat({
    generationConfig: { temperature: 1.0, maxOutputTokens: 500 },
    history: formattedHistory,
  });

  return chatbotSession;
};

export const sendChatMessage = async (
  message,
  currentHistory = [],
  tripsContext = ""
) => {
  try {
    if (!chatbotSession) {
      await initChatBot(currentHistory, tripsContext);
    }
    const result = await chatbotSession.sendMessage(message);
    return await result.response.text();
  } catch (err) {
    console.error("Chatbot Error:", err);
    return "I'm having a little trouble connecting right now. 🔌";
  }
};

export const generateTripDetails = async (selection) => {
  const { location, noOfDays, budget, traveler } = selection;
  const cleanDays = noOfDays.toString().replace(/\D/g, "");

  console.log("🚀 Generating Trip via Chatbot for:", {
    location,
    cleanDays,
    budget,
    traveler,
  });

  const FINAL_PROMPT = AI_PROMPT.replace("{location}", location)
    .replaceAll("{totalDays}", cleanDays)
    .replace("{traveler}", traveler)
    .replace("{budget}", budget);

  try {
    const session = getChatSession();
    const result = await session.sendMessage(FINAL_PROMPT);
    const responseText = await result.response.text();

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("❌ Trip Generation Error:", error);
    return null;
  }
};
