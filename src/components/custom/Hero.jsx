// import React from 'react'
// import { Button } from '../ui/button'
// import { Link } from 'react-router-dom'

// function Hero() {
//   return (
//     <div className='flex flex-col items-center mx-56 gap-9'>
//       <h1
//       className='font-extrabold text-[50px] leading-[1.1] text-center mt-16'>
//         <span className='text-[#f56551]'>Discover Your Next Adventure with AI:</span><br /> Personalized Itineraries at Your Fingertips
//         <p className='text-xl text-gray-500 text-center'>Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.</p>
//         <Link to={'/create-trip'}>
//           <Button> Get Startet, its free. </Button>
//         </Link>
//       </h1>

//     </div>
//   )
// }

// export default Hero
import React from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
      {" "}
      {/* Added gradient background for a fresh look */}
      <div className="max-w-4xl mx-auto text-center py-16 sm:py-20">
        {" "}
        {/* Added max-width and padding */}
        <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-tight sm:leading-tight lg:leading-tight text-gray-900 mb-6">
          <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600 animate-gradient-xy">
            {" "}
            {/* Enhanced gradient for key phrase */}
            Discover Your Next Adventure with AI:
          </span>
          <br />
          Personalized Itineraries at Your Fingertips
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mb-10 leading-relaxed">
          Your personal trip planner and travel curator, creating custom
          itineraries tailored to your interests and budget.
        </p>
        <Link to={"/create-trip"}>
          <Button
            className="
            px-8 py-3 sm:px-10 sm:py-4 
            text-lg sm:text-xl font-semibold 
            rounded-full 
            bg-gradient-to-r from-blue-600 to-indigo-700 text-white 
            shadow-lg 
            hover:shadow-xl hover:from-blue-700 hover:to-indigo-800 
            transform hover:-translate-y-1 
            transition-all duration-300 ease-in-out
            focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-75
          "
          >
            Get Started, it's free.
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Hero;
