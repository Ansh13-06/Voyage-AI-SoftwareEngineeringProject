// import React, { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { FaMapLocation } from "react-icons/fa6";
// import { Link } from "react-router-dom";
// import { GetPlacePhoto } from "../../service/GlobalAPI";

// function PlaceCardItem({ place }) {
//   const [imgUrl, setImgUrl] = useState("/placeholder.jpg");

//   // Fallback field mapping
//   const placeName =
//     place?.placeName || place?.name || place?.title || "Unknown Place";

//   const placeDetails =
//     place?.placeDetails ||
//     place?.description ||
//     place?.details ||
//     place?.info ||
//     "";

//   const ticketPricing =
//     place?.ticketPricing ||
//     place?.price ||
//     place?.entryFee ||
//     place?.ticketPrice ||
//     "";

//   const bestTimeToVisit =
//     place?.bestTimeToVisit ||
//     place?.timeToTravel ||
//     place?.visitTime ||
//     place?.whenToVisit ||
//     "";

//   const timeTravel =
//     place?.timeTravel ||
//     place?.travelTime ||
//     place?.duration ||
//     place?.timeRequired ||
//     "";

//   useEffect(() => {
//     if (!placeName) return;

//     const loadImage = async () => {
//       try {
//         const data = await GetPlacePhoto(placeName);
//         const url = data?.results?.[0]?.urls?.regular;

//         if (url) setImgUrl(url);
//       } catch (err) {
//         console.error("❌ Image fetch failed:", err);
//       }
//     };

//     loadImage();
//   }, [placeName]);

//   return (
//     <Link
//       to={"https://www.google.com/maps/search/?api=1&query=" + placeName}
//       target="_blank"
//     >
//       <div className="border rounded-xl p-3 mt-2 flex gap-5 hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
//         <img
//           src={imgUrl}
//           alt={placeName}
//           className="w-[250px] h-[230px] rounded-2xl shadow-md object-cover duration-400 ease-out hover:scale-105 "
//         />

//         <div className="flex flex-col justify-between">
//           <h2 className="font-bold text-[22px]">{placeName}</h2>

//           {placeDetails && (
//             <p className="text-sm text-gray-500">{placeDetails}</p>
//           )}

//           {ticketPricing && (
//             <p className="text-sm text-gray-500">🎟 {ticketPricing}</p>
//           )}

//           {bestTimeToVisit && (
//             <h2 className="mt-2 text-orange-500">⏱ {bestTimeToVisit}</h2>
//           )}

//           {timeTravel && (
//             <p className="text-sm text-gray-500">⏳ {timeTravel}</p>
//           )}

//           <Button className="mt-4 bg-blue-500 text-white hover:bg-blue-600">
//             <FaMapLocation />
//           </Button>
//         </div>
//       </div>
//     </Link>
//   );
// }

// export default PlaceCardItem;

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaMapLocationDot } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { GetPlacePhoto } from "../../service/GlobalAPI";

function PlaceCardItem({ place }) {
  // 🔥 CHANGED: Initialize with placeholder instead of null
  const [imgUrl, setImgUrl] = useState("/placeholder.jpg");

  const handleData = (data) => {
    if (typeof data === "string") return data;
    if (typeof data === "number") return data;
    if (typeof data === "object" && data !== null) {
      return Object.values(data).join(" ");
    }
    return "";
  };

  const placeName = handleData(
    place?.placeName || place?.name || place?.title || "Unknown Place"
  );
  const placeDetails = handleData(
    place?.placeDetails ||
      place?.description ||
      place?.details ||
      place?.info ||
      ""
  );
  const ticketPricing = handleData(
    place?.ticketPricing ||
      place?.price ||
      place?.entryFee ||
      place?.ticketPrice ||
      "Free"
  );
  const bestTimeToVisit = handleData(
    place?.bestTimeToVisit ||
      place?.timeToTravel ||
      place?.visitTime ||
      place?.whenToVisit ||
      "Anytime"
  );
  const timeTravel = handleData(
    place?.timeTravel ||
      place?.travelTime ||
      place?.duration ||
      place?.timeRequired ||
      ""
  );

  useEffect(() => {
    if (!placeName) return;

    const loadImage = async () => {
      try {
        const data = await GetPlacePhoto(placeName);
        const url = data?.results?.[0]?.urls?.regular;
        // 🔥 CHANGED: Only update if we found a valid URL
        if (url) setImgUrl(url);
      } catch (err) {
        console.error("❌ Image fetch failed");
      }
    };
    loadImage();
  }, [placeName]);

  return (
    <Link
      to={"https://www.google.com/maps/search/?api=1&query=" + placeName}
      target="_blank"
      className="block w-full"
    >
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-5 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 cursor-pointer w-full items-start">
        {/* Image Section */}
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 xl:w-[200px] xl:h-[200px] flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
          {/* 🔥 CHANGED: Always render the img tag. It starts as placeholder, then updates. */}
          <img
            src={imgUrl}
            alt={placeName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* Content Section */}
        <div className="flex flex-col justify-between flex-grow h-full min-h-[130px] xl:min-h-[200px]">
          <div>
            <h2 className="font-bold text-xl text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">
              {placeName}
            </h2>

            {placeDetails && (
              <p className="text-sm text-gray-500 mb-4 line-clamp-3 leading-relaxed max-w-4xl">
                {placeDetails}
              </p>
            )}

            <div className="flex flex-wrap gap-3 mb-3">
              {bestTimeToVisit && (
                <span className="text-xs font-medium bg-orange-50 text-orange-600 px-3 py-1 rounded-full">
                  ⏱ {bestTimeToVisit}
                </span>
              )}
              {ticketPricing && (
                <span className="text-xs font-medium bg-green-50 text-green-600 px-3 py-1 rounded-full">
                  🎟 {ticketPricing}
                </span>
              )}
            </div>

            {timeTravel && (
              <p className="text-xs text-gray-400 font-medium mt-1">
                ⏳ {timeTravel}
              </p>
            )}
          </div>

          <div className="mt-3">
            <Button className="h-9 px-4 text-sm rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-sm">
              <FaMapLocationDot className="mr-2" /> View on Map
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PlaceCardItem;
