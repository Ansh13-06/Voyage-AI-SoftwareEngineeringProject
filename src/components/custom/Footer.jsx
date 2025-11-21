// import React from "react";
// import { Link } from "react-router-dom";

// function Footer() {
//   return (
//     <footer className="mt-32 w-full bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 text-gray-300 py-10 relative overflow-hidden">
//       {/* Decorative Top Glow */}
//       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-70 shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>

//       <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center md:items-start gap-10">
//         {/* 1. Brand Section */}
//         <div className="flex flex-col gap-4 items-center md:items-start max-w-md text-center md:text-left">
//           <div className="flex items-center gap-3">
//             {/* Logo Icon */}
//             <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
//               <span className="text-white font-black text-xl">V</span>
//             </div>
//             <h2 className="font-bold text-2xl text-white tracking-tight">
//               Voyage AI
//             </h2>
//           </div>
//           <p className="text-sm leading-relaxed opacity-70">
//             Your personal AI-powered travel curator. Discover the world's hidden
//             gems and plan your dream trips with effortless ease.
//           </p>
//         </div>

//         {/* 2. Quick Links */}
//         <div className="flex gap-8 text-sm font-medium">
//           <Link
//             to="/"
//             className="hover:text-white hover:underline underline-offset-4 transition-all"
//           >
//             Home
//           </Link>
//           <Link
//             to="/create-trip"
//             className="hover:text-white hover:underline underline-offset-4 transition-all"
//           >
//             Create Trip
//           </Link>
//           <Link
//             to="/my-trips"
//             className="hover:text-white hover:underline underline-offset-4 transition-all"
//           >
//             My Trips
//           </Link>
//         </div>
//       </div>

//       {/* Bottom Bar */}
//       <div className="mt-12 pt-8 border-t border-white/10 flex flex-col items-center justify-center gap-4">
//         {/* 🔥 EYE-CATCHING CREDIT SECTION 🔥 */}
//         <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-full backdrop-blur-md shadow-xl hover:bg-white/10 transition-all duration-300 group cursor-default">
//           <h2 className="text-gray-300 font-medium flex items-center gap-2 text-sm sm:text-base">
//             Designed & Built with
//             <span className="text-red-500 animate-pulse text-xl drop-shadow-lg">
//               ❤
//             </span>
//             by
//             <a
//               href="https://github.com/nsh"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-extrabold text-lg sm:text-xl tracking-wide group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
//             >
//               @nsh & Team
//             </a>
//           </h2>
//         </div>

//         <p className="text-xs text-gray-500">
//           © {new Date().getFullYear()} Voyage AI. All rights reserved.
//         </p>
//       </div>
//     </footer>
//   );
// }

// export default Footer;
import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    // w-full ensures it covers the whole width
    <footer className="mt-20 w-full bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 text-gray-300 py-10 relative overflow-hidden">
      {/* Decorative Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-70 shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center md:items-start gap-10">
        {/* Brand Section */}
        <div className="flex flex-col gap-4 items-center md:items-start max-w-md text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-white font-black text-xl">V</span>
            </div>
            <h2 className="font-bold text-2xl text-white tracking-tight">
              Voyage AI
            </h2>
          </div>
          <p className="text-sm leading-relaxed opacity-70">
            Your personal AI-powered travel curator. Discover the world's hidden
            gems and plan your dream trips with effortless ease.
          </p>
        </div>

        {/* Links */}
        <div className="flex gap-8 text-sm font-medium">
          <Link
            to="/"
            className="hover:text-white hover:underline underline-offset-4 transition-all"
          >
            Home
          </Link>
          <Link
            to="/create-trip"
            className="hover:text-white hover:underline underline-offset-4 transition-all"
          >
            Create Trip
          </Link>
          <Link
            to="/my-trips"
            className="hover:text-white hover:underline underline-offset-4 transition-all"
          >
            My Trips
          </Link>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-12 pt-8 border-t border-white/10 flex flex-col items-center justify-center gap-4">
        <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-full backdrop-blur-md shadow-xl hover:bg-white/10 transition-all duration-300 group cursor-default">
          <h2 className="text-gray-300 font-medium flex items-center gap-2 text-sm sm:text-base">
            Designed & Built with
            <span className="text-red-500 animate-pulse text-xl drop-shadow-lg">
              ❤
            </span>
            by
            <a
              href="https://github.com/Ansh13-06"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent font-extrabold text-lg sm:text-xl tracking-wide group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
            >
              @nsh & TEAM
            </a>
          </h2>
        </div>

        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} Voyage AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
