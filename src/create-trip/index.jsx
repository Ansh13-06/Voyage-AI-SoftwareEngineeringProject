// // FULL UPDATED CreateTrip COMPONENT WITH GOOGLE LOGIN + PROFILE FIXES
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { SelectBudgetOptions, SelectTravelesList } from "@/constants/options";
// import { toast } from "sonner";
// import { AI_PROMPT } from "@/constants/options";
// import { getChatSession } from "@/service/AIModel";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
// } from "@/components/ui/dialog";
// import { FcGoogle } from "react-icons/fc";
// import { useGoogleLogin } from "@react-oauth/google";
// import { doc, setDoc } from "firebase/firestore";
// import { db } from "@/service/firebaseConfig";
// import { AiOutlineLoading3Quarters } from "react-icons/ai";
// import { useNavigate } from "react-router-dom";

// function CreateTrip() {
//   const [place, setPlace] = useState("");
//   const [openDialog, setOpenDialog] = useState(false);
//   const [suggestions, setSuggestions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     location: "",
//     noOfDays: "",
//     budget: "",
//     traveler: "",
//   });

//   const navigate = useNavigate();

//   const handlePlaceChange = async (e) => {
//     const value = e.target.value;
//     setPlace(value);

//     if (value.length > 2) {
//       try {
//         const response = await axios.get(
//           `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
//             value
//           )}.json`,
//           {
//             params: {
//               access_token: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
//               autocomplete: true,
//               limit: 5,
//             },
//           }
//         );
//         setSuggestions(response.data.features);
//       } catch (error) {
//         console.error("Error fetching suggestions:", error);
//       }
//     } else {
//       setSuggestions([]);
//     }
//   };

//   const handleSelectPlace = (suggestion) => {
//     setPlace(suggestion.place_name);
//     setSuggestions([]);
//     setFormData({ ...formData, location: suggestion.place_name });
//   };

//   const handleInputChange = (name, value) => {
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleOptionSelect = (name, value) => {
//     setFormData({ ...formData, [name]: value });
//   };

//   // ---------------- GOOGLE LOGIN ----------------
//   const login = useGoogleLogin({
//     onSuccess: async (tokenResponse) => {
//       try {
//         console.log("🟢 Google Login Success:", tokenResponse);
//         await GetUserProfile(tokenResponse);
//       } catch (err) {
//         console.error("🔴 Error after Google login:", err);
//         toast("❌ Failed to fetch Google profile.");
//       }
//     },
//     onError: (error) => {
//       console.error("🔴 Google Login Error:", error);
//       toast("❌ Google Login Failed. Try again.");
//     },
//   });

//   // ---------------- GET USER PROFILE ----------------
//   const GetUserProfile = async (tokenInfo) => {
//     try {
//       const response = await axios.get(
//         "https://www.googleapis.com/oauth2/v1/userinfo",
//         {
//           params: {
//             access_token: tokenInfo?.access_token,
//           },
//           headers: {
//             Authorization: `Bearer ${tokenInfo?.access_token}`,
//           },
//         }
//       );

//       localStorage.setItem("user", JSON.stringify(response.data));
//       setOpenDialog(false);
//       OnGenerateTrip();
//     } catch (error) {
//       console.error("🔴 Failed to fetch Google profile:", error);
//       toast("❌ Failed to load user profile.");
//     }
//   };

//   const OnGenerateTrip = async () => {
//     const user = localStorage.getItem("user");

//     if (!user) {
//       setOpenDialog(true);
//       return;
//     }

//     const days = Number(formData.noOfDays);

//     if (!formData.location || !formData.budget || !formData.traveler || !days) {
//       toast("⚠️ Please fill in all fields before generating your itinerary.");
//       return;
//     }

//     if (days > 5) {
//       console.log("🚫 For trips longer than 5 days, please contact support.");
//       return;
//     }

//     setLoading(true);

//     const FINAL_PROMPT = AI_PROMPT.replace("{location}", formData.location)
//       .replaceAll("{totalDays}", days)
//       .replace("{traveler}", formData.traveler)
//       .replace("{budget}", formData.budget);

//     const chat = getChatSession();

//     try {
//       const result = await chat.sendMessage(FINAL_PROMPT);
//       let tripData;

//       try {
//         tripData = JSON.parse(result.response.text());
//       } catch (e) {
//         tripData = result.response.text();
//       }

//       await SaveTrip(tripData);
//     } catch (error) {
//       console.error("🚫 AI Model Request Failed:", error);

//       if (error.message.includes("503")) {
//         toast("⚠️ The AI model is overloaded. Try again soon.");
//       } else {
//         toast("❌ Something went wrong while generating your itinerary.");
//       }
//     }

//     setLoading(false);
//   };

//   const SaveTrip = async (TripData) => {
//     setLoading(true);
//     const user = JSON.parse(localStorage.getItem("user"));

//     if (!user) {
//       toast("⚠️ User not authenticated.");
//       return;
//     }

//     const docId = Date.now().toString();

//     await setDoc(doc(db, "AITrips", docId), {
//       userSelection: formData,
//       tripData: typeof TripData === "string" ? JSON.parse(TripData) : TripData,
//       userEmail: user.email,
//       id: docId,
//     });

//     setLoading(false);
//     navigate("/view-trip/" + docId);
//   };

//   return (
//     <div className="sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10 pd-44">
//       <h2 className="font-bold text-3xl">
//         Tell us your travel preferences 🏝🚢🌴
//       </h2>
//       <p className="mt-3 text-gray-500 text-xl">
//         Just provide some basic information, and our trip planner will generate
//         a customized itinerary.
//       </p>

//       <div className="mt-20 flex flex-col gap-10">
//         <div>
//           <h2 className="text-xl my-3 font-medium">
//             What is Destination of choice?
//           </h2>
//           <div className="relative">
//             <input
//               type="text"
//               value={place}
//               onChange={handlePlaceChange}
//               placeholder="Enter destination..."
//               className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />

//             {suggestions.length > 0 && (
//               <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded-lg shadow-lg max-h-60 overflow-y-auto">
//                 {suggestions.map((s) => (
//                   <li
//                     key={s.id}
//                     onClick={() => handleSelectPlace(s)}
//                     className="p-2 hover:bg-gray-100 cursor-pointer"
//                   >
//                     {s.place_name}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>

//         <div>
//           <h2 className="text-xl my-3 font-medium">How many days?</h2>
//           <Input
//             placeholder="Ex. 3 days"
//             type="number"
//             onChange={(e) => handleInputChange("noOfDays", e.target.value)}
//           />
//         </div>
//       </div>

//       <div className="mt-16">
//         <h2 className="text-xl my-3 font-medium">What is Your Budget?</h2>
//         <div className="flex gap-5 overflow-x-auto pb-4">
//           {SelectBudgetOptions.map((item, index) => (
//             <div
//               key={index}
//               onClick={() => handleOptionSelect("budget", item.title)}
//               className={`min-w-[200px] p-4 border cursor-pointer rounded-lg transition flex-shrink-0 ${
//                 formData.budget === item.title
//                   ? "border-blue-500 bg-blue-50 shadow-md"
//                   : "hover:shadow-lg"
//               }`}
//             >
//               <h2 className="text-4xl">{item.icon}</h2>
//               <h2 className="font-bold text-lg">{item.title}</h2>
//               <h2 className="text-sm text-gray-500">{item.desc}</h2>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="mt-10">
//         <h2 className="text-xl my-3 font-medium">
//           Who are you traveling with?
//         </h2>
//         <div className="flex gap-5 overflow-x-auto pb-4">
//           {SelectTravelesList.map((item, index) => (
//             <div
//               key={index}
//               onClick={() => handleOptionSelect("traveler", item.people)}
//               className={`min-w-[200px] p-4 border cursor-pointer rounded-lg transition flex-shrink-0 ${
//                 formData.traveler === item.people
//                   ? "border-blue-500 bg-blue-50 shadow-md"
//                   : "hover:shadow-lg"
//               }`}
//             >
//               <h2 className="text-4xl">{item.icon}</h2>
//               <h2 className="font-bold text-lg">{item.title}</h2>
//               <h2 className="text-sm text-gray-500">{item.desc}</h2>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="my-10 justify-center flex">
//         <Button disabled={loading} onClick={OnGenerateTrip}>
//           {loading ? (
//             <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" />
//           ) : (
//             "Generate Itinerary"
//           )}
//         </Button>
//       </div>
//       <Dialog open={openDialog} onOpenChange={setOpenDialog}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogDescription>
//               <img src="/logo.svg" />
//               <h2 className="font-bold text-lg mt-7">Sign-In with Google</h2>
//               <p>Sign-In to the web with the Google Authentication securely</p>

//               <Button
//                 onClick={login}
//                 className="w-full mt-5 flex gap-4 items-center"
//               >
//                 <FcGoogle className="h-7 w-7" /> Sign-In with Google
//               </Button>
//             </DialogDescription>
//           </DialogHeader>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// export default CreateTrip;
// FULL UPDATED CreateTrip COMPONENT WITH GOOGLE LOGIN + PROFILE FIXES
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SelectBudgetOptions, SelectTravelesList } from "@/constants/options";
import { toast } from "sonner";
import { AI_PROMPT } from "@/constants/options";
import { getChatSession } from "@/service/AIModel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

function CreateTrip() {
  const [place, setPlace] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    location: "",
    noOfDays: "",
    budget: "",
    traveler: "",
  });

  const navigate = useNavigate();

  const handlePlaceChange = async (e) => {
    const value = e.target.value;
    setPlace(value);

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
    setFormData({ ...formData, location: suggestion.place_name });
  };

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleOptionSelect = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  // ---------------- GOOGLE LOGIN ----------------
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log("🟢 Google Login Success:", tokenResponse);
        await GetUserProfile(tokenResponse);
      } catch (err) {
        console.error("🔴 Error after Google login:", err);
        toast("❌ Failed to fetch Google profile.");
      }
    },
    onError: (error) => {
      console.error("🔴 Google Login Error:", error);
      toast("❌ Google Login Failed. Try again.");
    },
  });

  // ---------------- GET USER PROFILE ----------------
  const GetUserProfile = async (tokenInfo) => {
    try {
      const response = await axios.get(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        {
          params: {
            access_token: tokenInfo?.access_token,
          },
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
          },
        }
      );

      localStorage.setItem("user", JSON.stringify(response.data));
      setOpenDialog(false);
      OnGenerateTrip();
    } catch (error) {
      console.error("🔴 Failed to fetch Google profile:", error);
      toast("❌ Failed to load user profile.");
    }
  };

  const OnGenerateTrip = async () => {
    const user = localStorage.getItem("user");

    if (!user) {
      setOpenDialog(true);
      return;
    }

    const days = Number(formData.noOfDays);

    if (!formData.location || !formData.budget || !formData.traveler || !days) {
      toast("⚠️ Please fill in all fields before generating your itinerary.");
      return;
    }

    if (days > 5) {
      console.log("🚫 For trips longer than 5 days, please contact support.");
      return;
    }

    setLoading(true);

    const FINAL_PROMPT = AI_PROMPT.replace("{location}", formData.location)
      .replaceAll("{totalDays}", days)
      .replace("{traveler}", formData.traveler)
      .replace("{budget}", formData.budget);

    const chat = getChatSession();

    try {
      const result = await chat.sendMessage(FINAL_PROMPT);
      let tripData;

      try {
        tripData = JSON.parse(result.response.text());
      } catch (e) {
        tripData = result.response.text();
      }

      await SaveTrip(tripData);
    } catch (error) {
      console.error("🚫 AI Model Request Failed:", error);

      if (error.message.includes("503")) {
        toast("⚠️ The AI model is overloaded. Try again soon.");
      } else {
        toast("❌ Something went wrong while generating your itinerary.");
      }
    }

    setLoading(false);
  };

  const SaveTrip = async (TripData) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      toast("⚠️ User not authenticated.");
      return;
    }

    const docId = Date.now().toString();

    await setDoc(doc(db, "AITrips", docId), {
      userSelection: formData,
      tripData: typeof TripData === "string" ? JSON.parse(TripData) : TripData,
      userEmail: user.email,
      id: docId,
    });

    setLoading(false);
    navigate("/view-trip/" + docId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-10 px-5 sm:px-10 md:px-32 lg:px-56">
      <div className="bg-white shadow-xl rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border border-gray-100">
        {/* HEADER SECTION */}
        <div className="text-center mb-10">
          <h2 className="font-extrabold text-4xl text-gray-900 mb-4">
            Tell us your travel preferences
            <span className="ml-2">🏝️🚢</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Just provide some basic information, and our AI trip planner will
            generate a customized itinerary curated just for you.
          </p>
        </div>

        <div className="flex flex-col gap-12">
          {/* DESTINATION INPUT */}
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-gray-700">
              What is your destination of choice?
            </h2>
            <div className="relative">
              <input
                type="text"
                value={place}
                onChange={handlePlaceChange}
                placeholder="e.g., Paris, Tokyo, New York..."
                className="w-full p-4 text-lg border border-gray-200 rounded-xl bg-gray-50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
              />

              {suggestions.length > 0 && (
                <ul className="absolute z-20 bg-white border border-gray-100 w-full mt-2 rounded-xl shadow-2xl max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                  {suggestions.map((s) => (
                    <li
                      key={s.id}
                      onClick={() => handleSelectPlace(s)}
                      className="p-3 hover:bg-indigo-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0 text-gray-700"
                    >
                      {s.place_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* DAYS INPUT */}
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-gray-700">
              How many days are you planning?
            </h2>
            <Input
              placeholder="e.g., 3"
              type="number"
              min="1" // 1. Visual: Stops the down-arrow at 1
              value={formData.noOfDays} // 2. Controlled: Binds UI to State
              onChange={(e) => {
                const val = e.target.value;
                // 3. Logic: Only update if value is empty (backspacing) or greater than 0
                if (val === "" || Number(val) > 0) {
                  handleInputChange("noOfDays", val);
                }
              }}
              className="w-full p-6 text-lg border border-gray-200 rounded-xl bg-gray-50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
            />
          </div>

          {/* BUDGET SELECTION */}
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-5">
              What is your budget?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {SelectBudgetOptions.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleOptionSelect("budget", item.title)}
                  className={`p-6 border rounded-xl cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center gap-2 ${
                    formData.budget === item.title
                      ? "border-indigo-500 bg-indigo-50 shadow-md ring-2 ring-indigo-200"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="text-4xl mb-2 bg-white p-2 rounded-full shadow-sm">
                    {item.icon}
                  </div>
                  <h2 className="font-bold text-lg text-gray-800">
                    {item.title}
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* TRAVELER SELECTION */}
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-5">
              Who are you traveling with?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {SelectTravelesList.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleOptionSelect("traveler", item.people)}
                  className={`p-6 border rounded-xl cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col items-center text-center gap-2 ${
                    formData.traveler === item.people
                      ? "border-indigo-500 bg-indigo-50 shadow-md ring-2 ring-indigo-200"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="text-4xl mb-2 bg-white p-2 rounded-full shadow-sm">
                    {item.icon}
                  </div>
                  <h2 className="font-bold text-lg text-gray-800">
                    {item.title}
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* GENERATE BUTTON */}
        <div className="mt-16 flex justify-center">
          <Button
            disabled={loading}
            onClick={OnGenerateTrip}
            className="w-full md:w-1/2 py-6 text-xl font-bold rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-2xl hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-1 transition-all duration-300"
          >
            {loading ? (
              <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" />
            ) : (
              "🚀 Generate Itinerary"
            )}
          </Button>
        </div>
      </div>

      {/* GOOGLE LOGIN DIALOG */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex flex-col items-center space-y-4">
            <div className="bg-indigo-50 p-3 rounded-full">
              <img src="/logo.svg" className="h-10 w-10" alt="Logo" />
            </div>
            <div className="text-center">
              <h2 className="font-bold text-2xl text-gray-900">
                Sign In Needed
              </h2>
              <DialogDescription className="text-gray-500 mt-2">
                Please sign in with Google securely to generate and save your
                trip.
              </DialogDescription>
            </div>

            <Button
              onClick={login}
              className="w-full mt-4 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 py-6 rounded-xl text-lg font-medium shadow-sm flex items-center justify-center gap-3 transition-all"
            >
              <FcGoogle className="h-6 w-6" />
              Sign In with Google
            </Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;
