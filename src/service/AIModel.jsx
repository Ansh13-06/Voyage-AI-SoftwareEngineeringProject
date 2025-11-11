// AIModel.jsx
import { GoogleGenAI } from "@google/genai";

let chatSession; // We will store the single chat session here

/**
 * Initializes the GoogleGenAI client and starts a chat session.
 * This is called only once, the first time getChatSession() is invoked.
 */
const initializeChat = () => {
  // 1. Get the key at the moment it's needed
  const API_KEY = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;

  // 2. Robust check for a valid API key (catches undefined, "", or "   ")
  if (!API_KEY || API_KEY.trim() === "") {
    console.error("------------------------------------------------");
    console.error("ERROR: VITE_GOOGLE_GEMINI_AI_API_KEY IS NOT SET");
    console.error("Please check your .env file. It might be empty or just spaces.");
    console.error("Make sure you restart your server after editing the .env file.");
    console.error("------------------------------------------------");
    throw new Error("API Key not found or is invalid. Please check your .env file.");
  }
  
  // 3. Log success and initialize the client
  console.log("Initializing GoogleGenAI (API Key found)...");
  
  const genAI = new GoogleGenAI(API_KEY);

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: 'application/json',
  };

  const history = [
    {
      role: 'user',
      parts: [
        {
          text: `Generate a Travel Plan for Location: Las Vegas,
          for 3 Days for a Couple with a Cheap budget.
          Give me Hotels options list with Hotel Name, Hotel Address,
          Price, hotel image URL, geo coordinates, rating, description,
          and suggest an itinerary with place names.`,
        },
      ],
    },
    {
      role: 'model',
      parts: [
        {
          text: `Sure! I’ll generate a 3-day Las Vegas travel plan
          including hotels, attractions, and travel timing —
          all in structured JSON format.`,
        },
      ],
    },
  ];

  // 4. Create and store the chat session
  chatSession = model.startChat({
    generationConfig,
    history,
  });

  return chatSession;
};

/**
 * Public function to get the chat session.
 * It will either return the existing session or create a new one.
 */
export const getChatSession = () => {
  // If the session isn't created yet, create it.
  // Otherwise, return the one we already have (Singleton pattern).
  if (!chatSession) {
    chatSession = initializeChat();
  }
  return chatSession;
};
