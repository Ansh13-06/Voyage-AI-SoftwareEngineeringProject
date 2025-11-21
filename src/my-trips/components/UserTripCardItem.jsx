// import React, { useEffect, useState } from "react";
// import { GetPlacePhoto } from "@/service/GlobalAPI";
// import { Link } from "react-router-dom";

// function UserTripCardItem({ trip }) {
//   const [photoUrl, setPhotoUrl] = useState("/placeholder.jpg");
//   const [loaded, setLoaded] = useState(false);

//   useEffect(() => {
//     const fetchPhoto = async () => {
//       try {
//         const response = await GetPlacePhoto({
//           textQuery: trip?.userSelection?.location,
//         });

//         const url = response?.results?.[0]?.urls?.regular;
//         setPhotoUrl(url || "/placeholder.jpg");
//       } catch (err) {
//         setPhotoUrl("/placeholder.jpg");
//       }
//     };

//     fetchPhoto();
//   }, [trip]);

//   return (
//     <Link to={`/view-trip/${trip.id}`}>
//       <div className="relative">
//         {/* Image with fade + scale animation */}
//         <img
//           src={photoUrl}
//           onLoad={() => setLoaded(true)}
//           alt="trip"
//           className={`hover:scale-105 object-cover cursor-pointer rounded-xl w-full h-100 overflow-hidden shadow-md transition-all duration-400 ease-out
//           ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
//         />

//         {/* Optional shimmer skeleton while loading */}
//         {!loaded && (
//           <div className="absolute inset-0 bg-gray-300 animate-pulse rounded-xl" />
//         )}

//         <div className="mt-3">
//           <h2 className="font-bold text-lg">{trip.userSelection.location}</h2>
//           <h2 className="text-sm text-gray-500">
//             {trip.userSelection.noOfDays} Days trip with{" "}
//             {trip.userSelection.budget} budget
//           </h2>
//         </div>
//       </div>
//     </Link>
//   );
// }

// export default UserTripCardItem;
import React, { useEffect, useState } from "react";
import { GetPlacePhoto } from "@/service/GlobalAPI";
import { Link } from "react-router-dom";

function UserTripCardItem({ trip }) {
  const [photoUrl, setPhotoUrl] = useState("/placeholder.jpg");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const response = await GetPlacePhoto({
          textQuery: trip?.userSelection?.location,
        });

        const url = response?.results?.[0]?.urls?.regular;
        setPhotoUrl(url || "/placeholder.jpg");
      } catch (err) {
        setPhotoUrl("/placeholder.jpg");
      }
    };

    fetchPhoto();
  }, [trip]);

  return (
    <Link to={`/view-trip/${trip.id}`}>
      <div className="border rounded-xl border-gray-200 p-3 hover:scale-105 transition-all hover:shadow-xl cursor-pointer bg-white h-full">
        <div className="relative">
          {/* Image with fade + scale animation */}
          <img
            src={photoUrl}
            onLoad={() => setLoaded(true)}
            alt="trip"
            className={`object-cover rounded-xl w-full h-100 transition-all duration-500 ease-in-out
          ${loaded ? "opacity-100" : "opacity-0"}`}
          />

          {/* Optional shimmer skeleton while loading */}
          {!loaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl" />
          )}
        </div>

        <div className="mt-4 px-1 space-y-1">
          <h2 className="font-bold text-lg text-gray-900 line-clamp-1">
            {trip.userSelection.location}
          </h2>
          <h2 className="text-sm text-gray-500">
            {trip.userSelection.noOfDays} Days trip with{" "}
            <span className="font-medium text-gray-700">
              {trip.userSelection.budget}
            </span>{" "}
            budget
          </h2>
        </div>
      </div>
    </Link>
  );
}

export default UserTripCardItem;
