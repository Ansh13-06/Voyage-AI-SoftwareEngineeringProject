// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { collection, query, where, getDocs } from "firebase/firestore";
// import { db } from "@/service/firebaseConfig";
// import UserTripCardItem from "./components/UserTripCardItem";

// function Mytrips() {
//   const navigate = useNavigate();
//   const [userTrips, setUserTrips] = useState([]);

//   useEffect(() => {
//     const GetUserTrips = async () => {
//       const user = localStorage.getItem("user");

//       if (!user) {
//         navigate("/");
//         return;
//       }

//       const userEmail = JSON.parse(user).email;

//       try {
//         const q = query(
//           collection(db, "AITrips"),
//           where("userEmail", "==", userEmail)
//         );

//         const querySnapshot = await getDocs(q);

//         let trips = [];
//         querySnapshot.forEach((doc) => {
//           trips.push({ id: doc.id, ...doc.data() });
//         });

//         setUserTrips(trips);
//       } catch (err) {
//         console.error("Error fetching trips:", err);
//       }
//     };

//     GetUserTrips();
//   }, [navigate]);

//   return (
//     <div className="sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10">
//       <h2 className="font-bold text-3xl">My Trips</h2>
//       <div className="p-4 my-4 rounded-lg shadow grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 mx:2">
//         {userTrips?.length > 0
//           ? userTrips.map((trip) => (
//               <div key={trip.id}>
//                 <UserTripCardItem trip={trip} />
//               </div>
//             ))
//           : [1, 2, 3, 4, 5, 6].map((item, indx) => (
//               <div
//                 key={indx}
//                 className="p-4 my-4 rounded-lg shadow grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 mx:2 bg-slate-200 animate-pulse h-100 w-full"
//               ></div>
//             ))}
//       </div>
//     </div>
//   );
// }

// export default Mytrips;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import UserTripCardItem from "./components/UserTripCardItem";

function Mytrips() {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);

  useEffect(() => {
    const GetUserTrips = async () => {
      const user = localStorage.getItem("user");

      if (!user) {
        navigate("/");
        return;
      }

      const userEmail = JSON.parse(user).email;

      try {
        const q = query(
          collection(db, "AITrips"),
          where("userEmail", "==", userEmail)
        );

        const querySnapshot = await getDocs(q);

        let trips = [];
        querySnapshot.forEach((doc) => {
          trips.push({ id: doc.id, ...doc.data() });
        });

        setUserTrips(trips);
      } catch (err) {
        console.error("Error fetching trips:", err);
      }
    };

    GetUserTrips();
  }, [navigate]);

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10">
      <h2 className="font-bold text-3xl text-gray-900">My Trips</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 mb-16">
        {userTrips?.length > 0
          ? userTrips.map((trip) => (
              <div key={trip.id}>
                <UserTripCardItem trip={trip} />
              </div>
            ))
          : [1, 2, 3, 4, 5, 6].map((item, indx) => (
              <div
                key={indx}
                className="h-[250px] w-full bg-slate-200 animate-pulse rounded-xl"
              ></div>
            ))}
      </div>
    </div>
  );
}

export default Mytrips;
