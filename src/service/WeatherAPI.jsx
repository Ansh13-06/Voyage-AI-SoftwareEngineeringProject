// 📄 src/service/WeatherApi.jsx
import axios from "axios";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = "https://api.weatherapi.com/v1/current.json";

export const getWeather = async (location) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: location,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Weather fetch error:", error);
    return null;
  }
};

// Helper to decide if it's a good time to visit
export const getWeatherRecommendation = (weatherData) => {
  if (!weatherData) return "Unable to fetch weather info.";

  const temp = weatherData.current.temp_c;
  const condition = weatherData.current.condition.text.toLowerCase();

  let verdict = "✅ **Yes, it's a great time to plan a trip!**";

  // Logic for "Not Okay"
  if (
    condition.includes("rain") ||
    condition.includes("storm") ||
    condition.includes("drizzle")
  ) {
    verdict = "⚠️ **Maybe reconsider.** It is currently raining there.";
  } else if (condition.includes("snow") || condition.includes("blizzard")) {
    verdict = "❄️ **Pack heavy!** It's snowing right now.";
  } else if (temp > 40) {
    verdict =
      "🥵 **It's extremely hot!** You might want to wait for cooler weather.";
  } else if (temp < 5) {
    verdict = "🥶 **It's freezing!** Only go if you love the cold.";
  }

  return verdict;
};
