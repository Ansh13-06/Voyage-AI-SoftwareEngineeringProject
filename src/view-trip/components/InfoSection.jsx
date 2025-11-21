import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaShareSquare, FaEdit } from "react-icons/fa";
import { GetPlacePhoto } from "@/service/GlobalAPI";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  SelectBudgetOptions,
  SelectTravelesList,
  AI_PROMPT,
} from "@/constants/options";
import { getChatSession } from "@/service/AIModel";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { toast } from "sonner";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function InfoSection({ trip }) {
  const [photoUrl, setPhotoUrl] = useState("/placeholder.jpg");
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState(null);

  // Edit Mode States
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [place, setPlace] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (trip) {
      fetchPlacePhoto();
      fetchWeather();
      // Initialize form data with existing trip details
      setFormData(trip?.userSelection);
      setPlace(trip?.userSelection?.location);
    }
  }, [trip]);

  const fetchPlacePhoto = async () => {
    const location = trip?.userSelection?.location;
    if (!location) return;
    setLoading(true);
    try {
      const response = await GetPlacePhoto({ textQuery: location });
      const imageUrl = response?.results?.[0]?.urls?.regular;
      if (imageUrl) setPhotoUrl(imageUrl);
    } catch (err) {
      console.error("❌ API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async () => {
    const location = trip?.userSelection?.location;
    if (!location) return;
    try {
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`
      );
      setWeather(response.data);
    } catch (error) {
      console.error("❌ Weather Fetch Error:", error);
    }
  };

  const checkTravelSuitability = () => {
    if (!weather) return null;
    const temp = weather.current.temp_c;
    const condition = weather.current.condition.text.toLowerCase();
    let advice = {
      status: "Good to Visit! ✅",
      color: "text-green-600 bg-green-50 border-green-200",
      msg: "The weather looks pleasant.",
    };
    if (
      condition.includes("rain") ||
      condition.includes("drizzle") ||
      condition.includes("storm")
    ) {
      advice = {
        status: "Carry an Umbrella ☔",
        color: "text-blue-600 bg-blue-50 border-blue-200",
        msg: "It's currently raining. You might want to check the forecast.",
      };
    } else if (condition.includes("snow") || temp < 5) {
      advice = {
        status: "It's Freezing! ❄️",
        color: "text-cyan-600 bg-cyan-50 border-cyan-200",
        msg: "Pack heavy woolens, it's very cold.",
      };
    } else if (temp > 35) {
      advice = {
        status: "It's Hot! 🥵",
        color: "text-orange-600 bg-orange-50 border-orange-200",
        msg: "It might be too hot for outdoor activities.",
      };
    }
    return advice;
  };

  const recommendation = checkTravelSuitability();

  // --- SHARE FUNCTIONALITY HANDLER ---
  const handleShare = () => {
    const shareUrl = window.location.href;

    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        toast("✅ Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast("❌ Failed to copy link.");
      });
  };

  // --- EDIT FUNCTIONALITY HANDLERS ---

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handlePlaceChange = async (e) => {
    const value = e.target.value;
    setPlace(value);
    handleInputChange("location", value);

    if (value.length > 2) {
      try {
        const response = await axios.get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            value
          )}.json`,
          {
            params: {
              access_token: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
              autocomplete: true,
              limit: 5,
            },
          }
        );
        setSuggestions(response.data.features);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectPlace = (suggestion) => {
    setPlace(suggestion.place_name);
    setSuggestions([]);
    handleInputChange("location", suggestion.place_name);
  };

  const handleUpdateTrip = async () => {
    const days = Number(formData.noOfDays);
    if (!formData.location || !formData.budget || !formData.traveler || !days) {
      toast("⚠️ Please fill in all fields.");
      return;
    }
    if (days > 5) {
      toast("⚠️ Max 5 days allowed.");
      return;
    }

    setUpdateLoading(true);
    const FINAL_PROMPT = AI_PROMPT.replace("{location}", formData.location)
      .replaceAll("{totalDays}", days)
      .replace("{traveler}", formData.traveler)
      .replace("{budget}", formData.budget);

    try {
      const chat = getChatSession();
      const result = await chat.sendMessage(FINAL_PROMPT);
      let newTripData;
      try {
        newTripData = JSON.parse(result.response.text());
      } catch (e) {
        newTripData = result.response.text();
      }

      // Update Firebase
      const docRef = doc(db, "AITrips", trip?.id);
      await updateDoc(docRef, {
        userSelection: formData,
        tripData: newTripData,
      });

      toast("✅ Trip Updated Successfully!");
      window.location.reload(); // Reload to reflect changes
    } catch (error) {
      console.error("Update Error:", error);
      toast("❌ Failed to update trip.");
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Hero Image */}
      <div className="w-full h-[300px] md:h-[450px] rounded-3xl overflow-hidden shadow-2xl relative group">
        {loading && (
          <div className="absolute inset-0 animate-pulse bg-gray-200" />
        )}
        <img
          src={photoUrl}
          alt="Trip background"
          className={`w-full h-full object-cover transition-all duration-1000 ease-in-out group-hover:scale-105 ${
            loading ? "blur-lg scale-110" : "blur-0 scale-100"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-8 left-8 text-white drop-shadow-lg">
          <h2 className="font-bold text-4xl md:text-5xl mb-2">
            {trip?.userSelection?.location}
          </h2>
        </div>
      </div>

      {/* Tags & Weather */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3 justify-between items-center">
          <div className="flex flex-wrap gap-3">
            <span className="py-2 px-4 rounded-full bg-white border border-gray-200 text-gray-600 text-sm md:text-md font-medium shadow-sm flex items-center gap-2">
              📅 {trip?.userSelection?.noOfDays} Days
            </span>
            <span className="py-2 px-4 rounded-full bg-white border border-gray-200 text-gray-600 text-sm md:text-md font-medium shadow-sm flex items-center gap-2">
              💰 {trip?.userSelection?.budget} Budget
            </span>
            <span className="py-2 px-4 rounded-full bg-white border border-gray-200 text-gray-600 text-sm md:text-md font-medium shadow-sm flex items-center gap-2">
              👨‍👦‍👦 {trip?.userSelection?.traveler}
            </span>
            {weather && (
              <span className="py-2 px-4 rounded-full bg-white border border-gray-200 text-gray-600 text-sm md:text-md font-medium shadow-sm flex items-center gap-2">
                <img
                  src={weather.current.condition.icon}
                  className="w-6 h-6"
                  alt="weather"
                />
                {weather.current.temp_c}°C, {weather.current.condition.text}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={() => setOpenUpdateDialog(true)}
              className="rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 shadow-sm cursor-pointer"
            >
              <FaEdit className="mr-2" /> Edit
            </Button>
            <Button
              onClick={handleShare}
              className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg"
            >
              <FaShareSquare className="mr-2" /> Share
            </Button>
          </div>
        </div>

        {/* Recommendation Box */}
        {recommendation && (
          <div
            className={`p-4 rounded-xl border flex items-center justify-between gap-4 w-full md:w-fit ${recommendation.color}`}
          >
            <div>
              <h2 className="font-bold text-lg">{recommendation.status}</h2>
              <p className="text-sm opacity-80">{recommendation.msg}</p>
            </div>
          </div>
        )}
      </div>

      {/* EDIT TRIP DIALOG */}
      <Dialog open={openUpdateDialog} onOpenChange={setOpenUpdateDialog}>
        <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Edit your Trip
            </DialogTitle>
            <DialogDescription>
              Update your preferences to regenerate the itinerary.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-8 mt-5">
            {/* Destination */}
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-gray-700">
                Destination
              </h2>
              <div className="relative">
                <input
                  type="text"
                  value={place}
                  onChange={handlePlaceChange}
                  placeholder="Change destination..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                {suggestions.length > 0 && (
                  <ul className="absolute z-50 bg-white border border-gray-300 w-full mt-1 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {suggestions.map((s) => (
                      <li
                        key={s.id}
                        onClick={() => handleSelectPlace(s)}
                        className="p-2 hover:bg-indigo-50 cursor-pointer"
                      >
                        {s.place_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Days */}
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-gray-700">
                How many days?
              </h2>
              <Input
                type="number"
                min="1"
                max="5"
                value={formData?.noOfDays}
                onChange={(e) => handleInputChange("noOfDays", e.target.value)}
                className="text-lg p-3"
              />
            </div>

            {/* Budget */}
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-3">
                Budget
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {SelectBudgetOptions.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleInputChange("budget", item.title)}
                    className={`p-4 border rounded-xl cursor-pointer hover:shadow-lg transition-all flex flex-col items-center text-center gap-2 ${
                      formData?.budget === item.title
                        ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="text-3xl">{item.icon}</div>
                    <h2 className="font-bold text-sm">{item.title}</h2>
                  </div>
                ))}
              </div>
            </div>

            {/* Travelers */}
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-3">
                Who are you traveling with?
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {SelectTravelesList.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleInputChange("traveler", item.people)}
                    className={`p-4 border rounded-xl cursor-pointer hover:shadow-lg transition-all flex flex-col items-center text-center gap-2 ${
                      formData?.traveler === item.people
                        ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="text-3xl">{item.icon}</div>
                    <h2 className="font-bold text-sm">{item.title}</h2>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={handleUpdateTrip}
              disabled={updateLoading}
              className="w-full py-6 text-lg font-bold rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl"
            >
              {updateLoading ? (
                <AiOutlineLoading3Quarters className="animate-spin h-6 w-6" />
              ) : (
                "🔄 Update Itinerary"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default InfoSection;
