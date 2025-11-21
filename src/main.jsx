// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css";
// import App from "./App.jsx";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";

// import CreateTrip from "./create-trip";
// import Header from "./components/custom/Header.jsx";
// import { Toaster } from "./components/ui/sonner";
// import { GoogleOAuthProvider } from "@react-oauth/google";
// import Viewtrip from "./view-trip/[tripId]/index.jsx";
// import MyTrips from "./my-trips/index.jsx";

// // Chat Context + Chat UI
// import { ChatProvider } from "./context/ChatContext.jsx";
// import ChatWidget from "./components/custom/ChatWidget.jsx";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: (
//       <>
//         <Header />
//         <App />
//       </>
//     ),
//   },
//   {
//     path: "/create-trip",
//     element: (
//       <>
//         <Header />
//         <CreateTrip />
//       </>
//     ),
//   },
//   {
//     path: "/view-trip/:tripId",
//     element: (
//       <>
//         <Header />
//         <Viewtrip />
//       </>
//     ),
//   },
//   {
//     path: "/my-trips",
//     element: (
//       <>
//         <Header />
//         <MyTrips />
//       </>
//     ),
//   },
// ]);

// // ------------------------------
// //  WRAPPED APP WITH ChatProvider
// // ------------------------------

// createRoot(document.getElementById("root")).render(
//   <StrictMode>
//     <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_AUTH_ID}>
//       <ChatProvider>
//         <Toaster />
//         <RouterProvider router={router} />

//         {/* Chatbot stays persistent on all pages */}
//         <ChatWidget />
//       </ChatProvider>
//     </GoogleOAuthProvider>
//   </StrictMode>
// );
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import CreateTrip from "./create-trip";
import Header from "./components/custom/Header.jsx";
import Footer from "./components/custom/Footer.jsx"; // ✅ Import Footer
import { Toaster } from "./components/ui/sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Viewtrip from "./view-trip/[tripId]/index.jsx";
import MyTrips from "./my-trips/index.jsx";

// Chat Context + Chat UI
import { ChatProvider } from "./context/ChatContext.jsx";
import ChatWidget from "./components/custom/ChatWidget.jsx";

// ✅ Create a Layout component to handle Header & Footer globally
const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1">
        {/* Outlet renders the child route (App, CreateTrip, etc.) */}
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

const router = createBrowserRouter([
  {
    element: <Layout />, // ✅ Wrap all routes with the Layout
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/create-trip",
        element: <CreateTrip />,
      },
      {
        path: "/view-trip/:tripId",
        element: <Viewtrip />,
      },
      {
        path: "/my-trips",
        element: <MyTrips />,
      },
    ],
  },
]);

// ------------------------------
//  WRAPPED APP WITH ChatProvider
// ------------------------------

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_AUTH_ID}>
      <ChatProvider>
        <Toaster />
        <RouterProvider router={router} />

        {/* Chatbot stays persistent on all pages */}
        <ChatWidget />
      </ChatProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
