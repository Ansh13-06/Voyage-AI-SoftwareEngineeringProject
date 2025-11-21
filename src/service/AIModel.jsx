// ✅ AIModel.jsx
import { GoogleGenerativeAI } from "@google/generative-ai";

export let chatSession = null;

/**
 * Initializes Gemini and creates a reusable chat session.
 */
const initializeChat = () => {
  // Get API Key from Vite environment
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  // Validate API key
  if (!API_KEY || API_KEY.trim() === "") {
    console.error(
      "❌ Missing Gemini API Key. Please add VITE_GEMINI_API_KEY in your .env file."
    );
    throw new Error(
      "Gemini API key not found. Check your .env and restart the dev server."
    );
  }

  // Initialize the Gemini API client
  const genAI = new GoogleGenerativeAI(API_KEY);

  // Choose the Gemini model
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  // Generation config
  const generationConfig = {
    temperature: 0.7,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };

  // Optional default conversation history
  const history = [
    {
      role: "user",
      parts: [
        {
          text: `Generate Travel Plan for Location: Las Vegas, for 3 Days for Couple with a Cheap budget. 
          Give me a Hotels options list with Hotel Name, Hotel address, Price, hotel image url, 
          geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, 
          Place Image Url, Geo Coordinates, ticket Pricing, Time to travel for each location for 3 days.`,
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: "Sure! I'll generate a 3-day Las Vegas travel plan with hotels and itinerary in JSON format.",
        },
      ],
    },
  ];

  // Create a single chat session
  chatSession = model.startChat({
    generationConfig,
    history,
  });

  console.log("✅ Gemini chat session initialized successfully");
  return chatSession;
};

/**
 * Returns the existing chat session or initializes a new one if not present.
 */
export const getChatSession = () => {
  if (!chatSession) {
    chatSession = initializeChat();
  }
  return chatSession;
};

// ======================================================
// ⭐ ADDED CHATBOT FUNCTION — (Non-breaking addition)
// ======================================================

/**
 * Sends a normal chatbot message to Gemini and returns text response.
 * This does NOT modify any of your existing travel-planner logic.
 */
export const sendToAI = async (message) => {
  try {
    const session = getChatSession();
    const result = await session.sendMessage(message);

    // Extract the text safely
    const textResponse = result?.response?.text() || "No response from AI.";

    return textResponse;
  } catch (err) {
    console.error("❌ Chatbot Error:", err);
    return "Sorry, I'm having trouble responding right now.";
  }
};
