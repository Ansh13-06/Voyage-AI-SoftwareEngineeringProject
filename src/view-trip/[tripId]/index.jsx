// // import React, { useEffect, useState } from "react";
// // import { useParams } from "react-router-dom";
// // import { toast } from "sonner";
// // import { doc, getDoc } from "firebase/firestore";
// // import { db } from "../../service/firebaseConfig";
// // import InfoSection from "../components/InfoSection";
// // import Hotels from "../components/Hotels";
// // import PlacesToVisit from "../components/PlacesToVisit";
// // import Footer from "../components/Footer";

// // function Viewtrip() {
// //   const { tripId } = useParams();
// //   const [trip, setTrip] = useState(null); // ✅ useState, not useEffect

// //   useEffect(() => {
// //     if (tripId) {
// //       GetTripData();
// //     }
// //   }, [tripId]);

// //   const GetTripData = async () => {
// //     try {
// //       const docRef = doc(db, "AITrips", tripId);
// //       const docSnap = await getDoc(docRef);

// //       if (docSnap.exists()) {
// //         console.log("Document data:", docSnap.data());
// //         setTrip(docSnap.data()); // ✅ store trip data in state
// //       } else {
// //         console.log("No such document!");
// //         toast.error("No such document!");
// //       }
// //     } catch (error) {
// //       console.error("Error fetching trip data:", error);
// //       toast.error("Failed to load trip data.");
// //     }
// //   };

// //   return (
// //     <div className="p-10 md:px-20 lg:px-44 xl:px-56">
// //       {/* Information Section */}
// //       <InfoSection trip={trip} />

// //       {/* Recommendaed Section */}
// //       <Hotels trip={trip} />

// //       {/* Daily Plan */}
// //       <PlacesToVisit trip={trip} />

// //       {/* Footer */}
// //       <Footer trip={trip} />
// //     </div>
// //   );
// // }

// // export default Viewtrip;
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { toast } from "sonner";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../../service/firebaseConfig";
// import InfoSection from "../components/InfoSection";
// import Hotels from "../components/Hotels";
// import PlacesToVisit from "../components/PlacesToVisit";

// function Viewtrip() {
//   const { tripId } = useParams();
//   const [trip, setTrip] = useState(null); // ✅ useState, not useEffect

//   useEffect(() => {
//     if (tripId) {
//       GetTripData();
//     }
//   }, [tripId]);

//   const GetTripData = async () => {
//     try {
//       const docRef = doc(db, "AITrips", tripId);
//       const docSnap = await getDoc(docRef);

//       if (docSnap.exists()) {
//         console.log("Document data:", docSnap.data());
//         setTrip(docSnap.data()); // ✅ store trip data in state
//       } else {
//         console.log("No such document!");
//         toast.error("No such document!");
//       }
//     } catch (error) {
//       console.error("Error fetching trip data:", error);
//       toast.error("Failed to load trip data.");
//     }
//   };

//   return (
//     // ✨ Added gradient background and min-height
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
//       <div className="p-10 md:px-20 lg:px-44 xl:px-56 max-w-7xl mx-auto">
//         {/* Information Section */}
//         <InfoSection trip={trip} />

//         {/* Recommendaed Section */}
//         <Hotels trip={trip} />

//         {/* Daily Plan */}
//         <PlacesToVisit trip={trip} />
//       </div>
//     </div>
//   );
// }

// export default Viewtrip;
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../service/firebaseConfig";
import InfoSection from "../components/InfoSection";
import Hotels from "../components/Hotels";
import PlacesToVisit from "../components/PlacesToVisit";

// ❌ REMOVED: import Footer from "../components/Footer"; (Not needed anymore)

function Viewtrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    if (tripId) {
      GetTripData();
    }
  }, [tripId]);

  const GetTripData = async () => {
    try {
      const docRef = doc(db, "AITrips", tripId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setTrip(docSnap.data());
      } else {
        console.log("No such document!");
        toast.error("No such document!");
      }
    } catch (error) {
      console.error("Error fetching trip data:", error);
      toast.error("Failed to load trip data.");
    }
  };

  return (
    // ✨ Added gradient background and min-height
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="p-10 md:px-20 lg:px-44 xl:px-56 max-w-7xl mx-auto">
        {/* Information Section */}
        <InfoSection trip={trip} />

        {/* Recommended Section */}
        <Hotels trip={trip} />

        {/* Daily Plan */}
        <PlacesToVisit trip={trip} />

        {/* ❌ REMOVED: <Footer trip={trip} /> */}
        {/* The Global Footer in main.jsx will handle this now! */}
      </div>
    </div>
  );
}

export default Viewtrip;
