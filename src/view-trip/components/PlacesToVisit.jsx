// import React from "react";
// import PlaceCardItem from "./PlaceCardItem";

// function PlacesToVisit({ trip }) {
//   return (
//     <div>
//       <h2 className="font-bold text-lg mt-6">PlacesToVisit</h2>
//       <div className="mt-5">
//         {trip?.tripData?.itinerary.map((item, index) => (
//           <div key={index}>
//             <h2 className="font-medium text-lg">Day {item.day}</h2>
//             {(item.activities || item.plan)?.map((place, idx) => (
//               <div key={idx} className="my-3">
//                 <PlaceCardItem place={place} />
//               </div>
//             ))}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default PlacesToVisit;
import React from "react";
import PlaceCardItem from "./PlaceCardItem";

function PlacesToVisit({ trip }) {
  return (
    <div className="mt-10">
      <h2 className="font-bold text-2xl text-gray-900 mb-6">Places to Visit</h2>
      <div className="flex flex-col gap-8">
        {" "}
        {/* 🔥 CHANGED: flex-col or grid-cols-1 handles one item per row */}
        {trip?.tripData?.itinerary.map((item, index) => (
          <div
            key={index}
            className="bg-white/50 backdrop-blur-sm border border-gray-100 p-6 rounded-2xl shadow-sm"
          >
            {/* Day Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center font-bold shadow-md">
                {item.day}
              </div>
              <h2 className="font-bold text-xl text-gray-800">
                Day {item.day}
              </h2>
            </div>

            {/* List of Places */}
            <div className="grid grid-cols-1 gap-6">
              {" "}
              {/* 🔥 CHANGED: Forces 1 column layout */}
              {(item.activities || item.plan)?.map((place, idx) => (
                <div key={idx}>
                  <PlaceCardItem place={place} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlacesToVisit;
