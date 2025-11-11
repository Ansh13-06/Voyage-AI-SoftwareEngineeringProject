  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import { Input } from '@/components/ui/input';
  import { Button } from '@/components/ui/button';
  import { SelectBudgetOptions, SelectTravelesList } from '@/constants/options';
  import { toast } from 'sonner';
  import { AI_PROMPT } from '@/constants/options';
  // import { chatSession } from '@/service/AIModel';
        // 1. CHANGE THIS IMPORT:
  // We are no longer importing 'chatSession', but the new function
  import { getChatSession } from '@/service/AIModel';
  
  function CreateTrip() {
    const [place, setPlace] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [formData, setFormData] = useState({
      location: '',
      noOfDays: '',
      budget: '',
      traveler: '',
    });

    // ✅ Logs form data  when updated
    useEffect(() => {
      console.log('Form Data:', formData);
    }, [formData]);

    // ✅ Fetch suggestions from Mapbox
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
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setSuggestions([]);
      }
    };

    // ✅ When a place is selected
    const handleSelectPlace = (suggestion) => {
      setPlace(suggestion.place_name);
      setSuggestions([]);
      setFormData({ ...formData, location: suggestion.place_name });
    };

    // ✅ Handle other input changes
    const handleInputChange = (name, value) => {
      
      setFormData({
        ...formData,
        [name]: value,
      });
    };

    // ✅ Handle Budget & Companion selection
    const handleOptionSelect = (name, value) => {
      setFormData({
        ...formData,
        [name]: value,
      });
    };

    // // ✅ Submit handler
    // const handleSubmit = () => {
    //   console.log('Generating itinerary with data:', formData);
    //   // Future: Call Gemini itinerary API here
    // };

    // const OnGenerateTrip = async () => {
    //   const days = Number(formData.noOfDays);

    //   if (!formData.location || !formData.budget || !formData.traveler || !days) {
    //     // console.log("⚠️ Please fill in all fields before generating your itinerary.");
    //     toast("⚠️ Please fill in all fields before generating your itinerary."); 
    //     return;
    //   }

    //   if (days > 5) {
    //     console.log("🚫 For trips longer than 5 days, please contact support for a custom plan.");
    //     return;
    //   }
    //   // console.log("✅ Ready to generate trip:", formData);
    //   const FINAL_PROMPT = AI_PROMPT.replace('{location}', formData.location ).replaceAll('{totalDays}', days).replace('{traveler}', formData.traveler).replace('{budget}', formData.budget);

    //   console.log(FINAL_PROMPT)

    //   const result = await chatSession.sendMessage(FINAL_PROMPT);
    //   try {
    //     const jsonResponse = JSON.parse(result.response.text());
    //     console.log("JSON Response:", jsonResponse);
    //   } catch (e) {
    //     console.log("Raw Response:", result.response.text());
    //   }
    // };

// ... (your component code)

  const OnGenerateTrip = async () => {
    const days = Number(formData.noOfDays);

    if (!formData.location || !formData.budget || !formData.traveler || !days) {
      toast("⚠️ Please fill in all fields before generating your itinerary."); 
      return;
    }
    if (days > 5) {
      console.log("🚫 For trips longer than 5 days, please contact support for a custom plan.");
      return;
    }

    const FINAL_PROMPT = AI_PROMPT.replace('{location}', formData.location ).replaceAll('{totalDays}', days).replace('{traveler}', formData.traveler).replace('{budget}', formData.budget);
    console.log(FINAL_PROMPT);

    // 2. CHANGE THIS LINE:
    // Call the function to get the chat session.
    // This will initialize it on the first click, and reuse it on subsequent clicks.
    const chat = getChatSession(); 

    // 3. Use the 'chat' variable (this line was probably already correct)
    const result = await chat.sendMessage(FINAL_PROMPT);
    
    try {
      const jsonResponse = JSON.parse(result.response.text());
      console.log("JSON Response:", jsonResponse);
    } catch (e) {
      console.log("Raw Response:", result.response.text());
    }
  };

    
    return (
      <div className="sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10">
        <h2 className="font-bold text-3xl">Tell us your travel preferences 🏝🚢🌴</h2>
        <p className="mt-3 text-gray-500 text-xl">
          Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
        </p>

        {/* Destination + Days Section */}
        <div className="mt-20 flex flex-col gap-10">
          {/* Destination Input */}
          <div>
            <h2 className="text-xl my-3 font-medium">What is Destination of choice?</h2>

            <div className="relative">
              <input
                type="text"
                value={place}
                onChange={handlePlaceChange}
                placeholder="Enter destination..."
                className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {suggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {suggestions.map((suggestion) => (
                    <li
                      key={suggestion.id}
                      onClick={() => handleSelectPlace(suggestion)}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {suggestion.place_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Days Input */}
          <div>
            <h2 className="text-xl my-3 font-medium">How many days are you planning your trip?</h2>
            <Input
              placeholder="Ex. 3 days"
              type="number"
              onChange={(e) => handleInputChange('noOfDays', e.target.value)}
            />
          </div>
        </div>

        {/* Budget Section */}
        <div className="mt-16">
          <h2 className="text-xl my-3 font-medium">What is Your Budget?</h2>
          <div className="flex gap-5 overflow-x-auto pb-4">
            {SelectBudgetOptions.map((item, index) => (
              <div
                key={index}
                onClick={() => handleOptionSelect('budget', item.title)}
                className={`min-w-[200px] p-4 border cursor-pointer rounded-lg transition flex-shrink-0
                  ${
                    formData.budget === item.title
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'hover:shadow-lg'
                  }`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        {/* Travel Companion Section */}
        <div className="mt-10">
          <h2 className="text-xl my-3 font-medium">Who do you want to travel with on your adventure?</h2>
          <div className="flex gap-5 overflow-x-auto pb-4">
            {SelectTravelesList.map((item, index) => (
              <div
                key={index}
                onClick={() => handleOptionSelect('traveler', item.people)}
                className={`min-w-[200px] p-4 border cursor-pointer rounded-lg transition flex-shrink-0
                  ${
                    formData.traveler === item.people 
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'hover:shadow-lg'
                  }`}
              >
                <h2 className="text-4xl">{item.icon}</h2>
                <h2 className="font-bold text-lg">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Itinerary Button */}
        <div className="my-10 justify-end flex">
          <Button onClick={OnGenerateTrip}>Generate Itinerary</Button>
          {/* <Button onClick={handleSubmit}>Generate Itinerary</Button> */}
        </div>
      </div>
    );
  }

  export default CreateTrip;
