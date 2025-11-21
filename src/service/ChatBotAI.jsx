// // 📄 src/service/ChatBotAI.jsx
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { AI_PROMPT } from "@/constants/options";
// import { getChatSession } from "@/service/AIModel"; // 🔥 FIX 1: Import the function, not the variable

// const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
// const genAI = new GoogleGenerativeAI(API_KEY);

// let chatbotSession = null;

// // ---------------------------------------------------------
// // 1️⃣ Initialize Chatbot Persona (Orbit)
// // ---------------------------------------------------------
// export const initChatBot = async (history = [], tripsContext = "") => {
//   const systemPrompt = `
//     You are Orbit, an AI Travel Assistant.

//     CONTEXT:
//     The user has these past trips in their database: ${tripsContext}

//     🛑 IMPORTANT INSTRUCTION FOR TRIP PLANNING:
//     If the user asks to "Create a trip", "Plan a trip", or gives details like "Trip to Dubai for 4 days",
//     you must ANALYZE their input and map it to the following standard categories:

//     1. **Budget**: Map their words to strictly one of: "Cheap", "Moderate", "Luxury".
//        (e.g., "rich" -> "Luxury", "budget friendly" -> "Cheap")

//     2. **Traveler**: Map their words to strictly one of: "Just Me", "A Couple", "Family", "Friends".
//        (e.g., "1 person" or "solo" -> "Just Me", "2 people" or "wife" -> "A Couple")

//     OUTPUT FORMAT:
//     Return ONLY a JSON OBJECT with this schema:
//     {
//       "isTripPlan": true,
//       "userSelection": {
//         "location": "The destination city name",
//         "noOfDays": "Number only (e.g. 3)",
//         "budget": "Cheap" | "Moderate" | "Luxury",
//         "traveler": "Just Me" | "A Couple" | "Family" | "Friends"
//       }
//     }

//     For all other questions, answer normally with emojis.
//   `;

//   const model = genAI.getGenerativeModel({
//     model: "gemini-2.5-flash-lite",
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

// // ---------------------------------------------------------
// // 2️⃣ Send Chat Message
// // ---------------------------------------------------------
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

// // ---------------------------------------------------------
// // 3️⃣ 🔥 GENERATE TRIP (Fixed for "Glitch" Error)
// // ---------------------------------------------------------
// export const generateTripDetails = async (selection) => {
//   const { location, noOfDays, budget, traveler } = selection;

//   // Safety: Ensure days is a pure number
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
//     // 🔥 FIX 2: Call getChatSession() to ensure it's initialized!
//     const session = getChatSession();

//     const result = await session.sendMessage(FINAL_PROMPT);
//     const responseText = await result.response.text();

//     console.log("🤖 Raw AI Response:", responseText);

//     // Fix JSON Cleaning
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
// 📄 src/service/ChatBotAI.jsx
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
    2. **Duration** (No. of Days) - Extract number (e.g., "2 days" -> "2")
    3. **Budget** (Map to: Cheap, Moderate, Luxury) 
       - Examples: "budget friendly"->"Cheap", "standard/mid"->"Moderate", "rich/high"->"Luxury".
    4. **Traveler** (Map to: Just Me, A Couple, Family, Friends)
       - Examples: "solo"->"Just Me", "couples/wife/partner"->"A Couple", "with kids"->"Family".

    🧠 MEMORY & LOGIC:
    1. Analyze the user's input. **Combine it with previous conversation context.** (e.g., If user previously said "Goa for 2 days" and now says "Moderate", you now have Location, Days, and Budget).
    2. **IF DETAILS ARE MISSING:** - Ask for the specific missing info politely.
       - List options for Budget/Traveler to guide the user.
    3. **IF ALL 4 DETAILS ARE PRESENT (either in this message or combined with history):**
       - Return a JSON OBJECT with this schema:
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
    model: "gemini-2.5-flash-lite", // Switched to 1.5-flash for better instruction following
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
    const session = getChatSession(); // Using the robust session getter
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
