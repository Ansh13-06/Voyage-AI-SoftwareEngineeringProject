// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { GetPlacePhoto } from "@/service/GlobalAPI";

// function Hotels({ trip }) {
//   // Store fetched photos for each hotel (indexed)
//   const [photos, setPhotos] = useState({});

//   useEffect(() => {
//     if (trip?.tripData?.hotels) {
//       fetchHotelPhotos();
//     }
//   }, [trip]);

//   const fetchHotelPhotos = async () => {
//     const hotels = trip?.tripData?.hotels || [];

//     const photoResults = {};

//     for (let i = 0; i < hotels.length; i++) {
//       const hotel = hotels[i];

//       try {
//         const response = await GetPlacePhoto({ textQuery: hotel.hotelName });
//         const url = response?.results?.[0]?.urls?.regular;

//         photoResults[i] = {
//           url: url || "/placeholder.jpg",
//           loading: false,
//         };
//       } catch (err) {
//         photoResults[i] = {
//           url: "/placeholder.jpg",
//           loading: false,
//         };
//       }
//     }

//     setPhotos(photoResults);
//   };

//   const renderStars = (rating) => {
//     const fullStars = Math.floor(rating);
//     const halfStar = rating % 1 >= 0.5;
//     const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

//     return (
//       <span>
//         {"⭐".repeat(fullStars)}
//         {halfStar && "⯪"} {"✩".repeat(emptyStars)}
//       </span>
//     );
//   };

//   return (
//     <div>
//       <h2 className="font-bold text-xl mt-5">Hotel Recommendation</h2>

//       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
//         {trip?.tripData?.hotels?.map((hotel, index) => {
//           const hotelPhoto = photos[index];

//           return (
//             <Link
//               key={index}
//               to={
//                 "https://www.google.com/maps/search/?api=1&query=" +
//                 hotel?.hotelName +
//                 "," +
//                 hotel?.hotelAddress
//               }
//               target="_blank"
//             >
//               <div className="hover:scale-105 transition-all cursor-pointer rounded-xl overflow-hidden shadow-md duration-400 ease-out">
//                 <div className="relative w-full h-48">
//                   {/* Skeleton Loader */}
//                   {!hotelPhoto && (
//                     <div className="absolute inset-0 bg-gray-300 animate-pulse" />
//                   )}

//                   {/* Actual Image */}
//                   <img
//                     src={hotelPhoto?.url || "/placeholder.jpg"}
//                     alt={hotel?.hotelName}
//                     className={`
//                       w-full h-full object-cover transition-all duration-700
//                       ${!hotelPhoto ? "blur-lg scale-105" : "blur-0 scale-100"}
//                     `}
//                   />
//                 </div>

//                 {/* Hotel Info */}
//                 <div className="my-2 flex flex-col gap-2 p-2">
//                   <h2 className="text-[18px] font-bold">{hotel?.hotelName}</h2>

//                   <h2 className="text-[13px] text-gray-500">
//                     📍 {hotel?.hotelAddress}
//                   </h2>

//                   <h2 className="text-[13px] text-gray-500">
//                     📑 {hotel?.description}
//                   </h2>

//                   <h2 className="text-[15px] text-gray-600 font-semibold">
//                     💲 {hotel?.price}
//                   </h2>

//                   <div className="text-[15px] text-gray-600 font-semibold flex items-center gap-1">
//                     {renderStars(Number(hotel?.rating))}
//                     <span>({Number(hotel?.rating).toFixed(1)})</span>
//                   </div>
//                 </div>
//               </div>
//             </Link>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// export default Hotels;
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GetPlacePhoto } from "@/service/GlobalAPI";

function Hotels({ trip }) {
  const [photos, setPhotos] = useState({});

  useEffect(() => {
    if (trip?.tripData?.hotels) {
      fetchHotelPhotos();
    }
  }, [trip]);

  const fetchHotelPhotos = async () => {
    const hotels = trip?.tripData?.hotels || [];
    const photoResults = {};
    for (let i = 0; i < hotels.length; i++) {
      const hotel = hotels[i];
      try {
        const response = await GetPlacePhoto({ textQuery: hotel.hotelName });
        const url = response?.results?.[0]?.urls?.regular;
        photoResults[i] = { url: url || "/placeholder.jpg", loading: false };
      } catch (err) {
        photoResults[i] = { url: "/placeholder.jpg", loading: false };
      }
    }
    setPhotos(photoResults);
  };

  const renderStars = (rating) => {
    const numRating = Number(rating);
    if (isNaN(numRating))
      return <span className="text-gray-400 text-xs">Rating N/A</span>;

    const fullStars = Math.floor(numRating);
    const halfStar = numRating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <span className="text-yellow-500 text-sm">
        {"⭐".repeat(fullStars)}
        {halfStar && "⯪"} {"✩".repeat(Math.max(0, emptyStars))}
      </span>
    );
  };

  const getSafePrice = (price) => {
    if (typeof price === "object" && price !== null)
      return Object.values(price).join(" ");
    return price;
  };

  return (
    <div className="mt-12">
      <h2 className="font-bold text-2xl text-gray-900 mb-8">
        Hotel Recommendations
      </h2>

      {/* 🔥 CHANGED: Removed 'xl:grid-cols-4' so cards are wider (max 3 per row) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {trip?.tripData?.hotels?.map((hotel, index) => {
          const hotelPhoto = photos[index];

          return (
            <Link
              key={index}
              to={
                "https://www.google.com/maps/search/?api=1&query=" +
                hotel?.hotelName +
                "," +
                hotel?.hotelAddress
              }
              target="_blank"
              className="group"
            >
              <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer h-full flex flex-col">
                {/* 🔥 CHANGED: Increased height from h-48 to h-[250px] for a bigger look */}
                <div className="relative w-full h-[250px] overflow-hidden">
                  {!hotelPhoto && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                  )}
                  <img
                    src={hotelPhoto?.url || "/placeholder.jpg"}
                    alt={hotel?.hotelName}
                    className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                      !hotelPhoto ? "blur-lg" : "blur-0"
                    }`}
                  />
                </div>

                <div className="p-5 flex flex-col gap-3 flex-grow">
                  <h2 className="text-xl font-bold text-gray-900 leading-tight">
                    {hotel?.hotelName}
                  </h2>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    📍 {hotel?.hotelAddress}
                  </p>
                  <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
                    {hotel?.description}
                  </p>

                  <div className="mt-auto pt-4 flex justify-between items-center border-t border-gray-50">
                    <h2 className="text-lg font-semibold text-indigo-600">
                      💲 {getSafePrice(hotel?.price)}
                    </h2>
                    <div className="flex items-center gap-1">
                      {renderStars(hotel?.rating)}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Hotels;
