// 📄 GlobalAPI.jsx
import axios from "axios";
import { sendChatMessage } from "./ChatBotAI"; // ✅ Updated import

const UNSPLASH_URL = "https://api.unsplash.com/search/photos";

// -------------------------------------------------------------
// EXISTING FUNCTION (unchanged) — Fetch place images from Unsplash
// -------------------------------------------------------------
export const GetPlacePhoto = async (query) => {
  try {
    const textQuery = typeof query === "string" ? query : query?.textQuery;

    const res = await axios.get(UNSPLASH_URL, {
      params: {
        query: textQuery,
        per_page: 1,
      },
      headers: {
        Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("❌ Unsplash API Error:", error.response?.data || error);
    throw error;
  }
};

// -------------------------------------------------------------
// NEW CHATBOT API FUNCTION — now uses ChatBotAI.jsx
// -------------------------------------------------------------
export const AskChatBot = async (message) => {
  return {
    response: await sendChatMessage(message), // 👈 updated function
  };
};

// Export all services nicely
const GlobalAPI = {
  GetPlacePhoto,
  AskChatBot,
};

export default GlobalAPI;
