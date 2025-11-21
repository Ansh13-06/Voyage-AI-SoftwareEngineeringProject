// import React, { useEffect, useState } from "react";
// import { Button } from "../ui/button";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { googleLogout, useGoogleLogin } from "@react-oauth/google";
// import { useNavigate } from "react-router-dom";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
// } from "@/components/ui/dialog";
// import axios from "axios";
// import { toast } from "sonner";
// import { FcGoogle } from "react-icons/fc";

// function Header() {
//   const [openDialog, setOpenDialog] = useState(false);

//   // 🔥 Persistent user state
//   const [user, setUser] = useState(
//     JSON.parse(localStorage.getItem("user")) || null
//   );

//   const navigate = useNavigate();

//   useEffect(() => {
//     console.log("User data:", user);
//   }, [user]);

//   // Fetch Google Profile
//   const GetUserProfile = async (tokenInfo) => {
//     try {
//       const response = await axios.get(
//         "https://www.googleapis.com/oauth2/v1/userinfo",
//         {
//           params: { access_token: tokenInfo?.access_token },
//           headers: { Authorization: `Bearer ${tokenInfo?.access_token}` },
//         }
//       );

//       localStorage.setItem("user", JSON.stringify(response.data));
//       setUser(response.data); // 🔥 Update state

//       setOpenDialog(false);
//       navigate("/");
//     } catch (error) {
//       console.error("Failed to fetch Google profile:", error);
//       toast("❌ Failed to load user profile.");
//     }
//   };

//   // Google Login
//   const login = useGoogleLogin({
//     onSuccess: async (tokenResponse) => {
//       try {
//         await GetUserProfile(tokenResponse);
//       } catch {
//         toast("❌ Google Login Failed.");
//       }
//     },
//     onError: () => toast("❌ Google Login Failed."),
//   });

//   return (
//     <div className="w-full bg-white p-3 shadow-sm flex justify-between items-center px-5">
//       <img
//         src="/logo.svg"
//         alt="Logo"
//         className="h-10 cursor-pointer"
//         onClick={() => navigate("/")}
//       />

//       <div className="flex items-center gap-4">
//         {user ? (
//           <>
//             <Button
//               className="rounded-full cursor-pointer"
//               onClick={() => navigate("/create-trip")}
//             >
//               ➕ Create Trip
//             </Button>

//             <Button
//               variant="outline"
//               className="rounded-full cursor-pointer"
//               onClick={() => navigate("/my-trips")}
//             >
//               My Trips
//             </Button>

//             {/* PROFILE MENU */}
//             <Popover>
//               <PopoverTrigger>
//                 <img
//                   src="/unknown_user.png"
//                   alt="profile"
//                   className="w-10 h-10 rounded-full border shadow-sm object-cover cursor-pointer"
//                 />
//               </PopoverTrigger>

//               <PopoverContent className="w-48 p-4 cursor-pointer" align="end">
//                 <div className="flex flex-col items-center mb-3">
//                   <img
//                     src="/unknown_user.png"
//                     className="w-14 h-14 rounded-full border shadow-sm object-cover"
//                   />
//                   <h3 className="font-semibold mt-2">{user?.name}</h3>
//                   <p className="text-sm text-gray-500">{user?.email}</p>
//                 </div>

//                 <hr className="my-2" />

//                 <h2
//                   className="hover:bg-gray-100 p-2 rounded-md text-center font-medium"
//                   onClick={() => {
//                     googleLogout();
//                     localStorage.removeItem("user");
//                     setUser(null); // 🔥 Update UI
//                     navigate("/");
//                   }}
//                 >
//                   Log Out
//                 </h2>
//               </PopoverContent>
//             </Popover>
//           </>
//         ) : (
//           <Button onClick={() => setOpenDialog(true)}>Sign-In</Button>
//         )}
//       </div>

//       {/* SIGN-IN DIALOG */}
//       <Dialog open={openDialog} onOpenChange={setOpenDialog}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogDescription>
//               <img src="/logo.svg" className="mb-3" />
//               <h2 className="font-bold text-lg mt-3">Sign-In with Google</h2>
//               <p>Login securely using Google Authentication</p>

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

// export default Header;
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import axios from "axios";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";

function Header() {
  const [openDialog, setOpenDialog] = useState(false);

  // 🔥 Persistent user state
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const navigate = useNavigate();

  useEffect(() => {
    console.log("User data:", user);
  }, [user]);

  // Fetch Google Profile
  const GetUserProfile = async (tokenInfo) => {
    try {
      const response = await axios.get(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        {
          params: { access_token: tokenInfo?.access_token },
          headers: { Authorization: `Bearer ${tokenInfo?.access_token}` },
        }
      );

      localStorage.setItem("user", JSON.stringify(response.data));
      setUser(response.data); // 🔥 Update state

      setOpenDialog(false);
      navigate("/");
    } catch (error) {
      console.error("Failed to fetch Google profile:", error);
      toast("❌ Failed to load user profile.");
    }
  };

  // Google Login
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await GetUserProfile(tokenResponse);
      } catch {
        toast("❌ Google Login Failed.");
      }
    },
    onError: () => toast("❌ Google Login Failed."),
  });

  return (
    <div className="w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm sticky top-0 z-50 transition-all">
      <div className="flex justify-between items-center px-5 py-3 max-w-7xl mx-auto">
        {/* LOGO SECTION */}
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <img
            src="/logo.svg"
            alt="Logo"
            className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* NAVIGATION & ACTION SECTION */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button
                variant="outline"
                className="rounded-full text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-black transition-all duration-300"
                onClick={() => navigate("/my-trips")}
              >
                My Trips
              </Button>

              <Button
                className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-0.5 transition-all duration-300"
                onClick={() => navigate("/create-trip")}
              >
                <span className="mr-2">➕</span> Create Trip
              </Button>

              {/* PROFILE MENU */}
              <Popover>
                <PopoverTrigger>
                  <img
                    src="/unknown_user.png"
                    alt="profile"
                    className="w-10 h-10 rounded-full border-2 border-gray-100 shadow-sm object-cover cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-indigo-500 transition-all duration-200"
                  />
                </PopoverTrigger>

                <PopoverContent
                  className="w-56 p-0 overflow-hidden rounded-xl shadow-xl border border-gray-100"
                  align="end"
                >
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 flex flex-col items-center">
                    <img
                      src="/unknown_user.png"
                      className="w-16 h-16 rounded-full border-4 border-white shadow-md object-cover mb-2"
                    />
                    <h3 className="font-bold text-gray-800 text-center truncate w-full">
                      {user?.name}
                    </h3>
                    <p className="text-xs text-gray-500 truncate w-full text-center">
                      {user?.email}
                    </p>
                  </div>

                  <div className="p-2 bg-white">
                    <h2
                      className="cursor-pointer hover:bg-red-50 text-red-600 hover:text-red-700 p-2 rounded-lg text-center font-medium transition-colors duration-200 flex items-center justify-center gap-2"
                      onClick={() => {
                        googleLogout();
                        localStorage.removeItem("user");
                        setUser(null); // 🔥 Update UI
                        navigate("/");
                      }}
                    >
                      🚪 Log Out
                    </h2>
                  </div>
                </PopoverContent>
              </Popover>
            </>
          ) : (
            <Button
              onClick={() => setOpenDialog(true)}
              className="rounded-full bg-black text-white hover:bg-gray-800 transition-colors shadow-sm px-6"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>

      {/* SIGN-IN DIALOG */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-md rounded-xl">
          <DialogHeader className="flex flex-col items-center text-center space-y-4">
            <img src="/logo.svg" className="h-12 w-auto" alt="Voyage AI" />
            <div className="space-y-2">
              <h2 className="font-bold text-2xl text-gray-900">
                Sign In to Voyage AI
              </h2>
              <DialogDescription className="text-gray-500 text-sm">
                Login safely using your Google account to create and save your
                personalized itineraries.
              </DialogDescription>
            </div>

            <Button
              onClick={login}
              className="w-full mt-6 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 flex gap-3 items-center justify-center py-6 text-base font-medium shadow-sm transition-all rounded-lg"
            >
              <FcGoogle className="h-6 w-6" />
              Continue with Google
            </Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Header;
