// 'use client";';
// // import { motion } from "framer-motion";
// // import { motion } from "motion/react";
// import * as motion from "motion/react-client";

// import Image from "next/image";
// import React from "react";

// export function HeorSection() {
//   const sectionVariant = {
//     hidden: { opacity: 0, y: 50 },
//     visible: { opacity: 1, y: 0 },
//   };
//   return (
//     <section className="px-6 lg:px-16 py-16">
//       {/* <
//       // initial="hidden"
//       // whileInView="visible"
//       // viewport={{ once: true, amount: 0.2 }}
//       // transition={{ duration: 0.6 }}
//       // variants={sectionVariant}
//       /> */}
//       <motion.div
//         initial="hidden"
//         whileInView="visible"
//         viewport={{ once: true, amount: 0.2 }}
//         transition={{ duration: 0.6 }}
//         variants={sectionVariant}
//       >
//         <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between">
//           {/* Left Side (Text) */}
//           <div className="lg:w-1/2 text-center lg:text-left">
//             <span className="text-gray-500 text-lg font-semibold">
//               Ask Learn Build
//             </span>
//             <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mt-2">
//               <span className="text-red-500">Your Coding</span>
//               <span> Problems Solved</span>
//             </h1>
//             <p className="text-lg text-stone-800 mt-4">
//               Stuck on a bug? Need career advice? Connect with experts and get
//               the answers you need.
//             </p>
//             <button className="mt-6 px-6 py-3 bg-btnColor text-white font-semibold rounded-md shadow-md hover:bg-btnHoverCol transition">
//               Get started today
//             </button>
//           </div>

//           {/* Right Side (Image) */}
//           <div className="lg:w-1/3 flex justify-center mt-10 lg:mt-0">
//             <Image
//               src="/programmer.svg"
//               alt="Knowledge Sharing Illustration"
//               className="max-w-full h-auto"
//               width={500}
//               height={500}
//             />
//           </div>
//         </div>
//       </motion.div>
//     </section>
//   );
// }

// // export default HeorSection;

"use client";
import * as motion from "motion/react-client";
import Image from "next/image";
import React from "react";

export function HeorSection() {
  const sectionVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-6 lg:px-16 py-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 backdrop-blur-3xl"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-pink-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          variants={sectionVariant}
        >
          <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between">
            {/* Left Side (Text) */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-sm font-semibold rounded-full mb-4">
                Ask • Learn • Build
              </span>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mt-2 leading-tight">
                <span className="bg-gradient-to-r from-btnColor to-pink-600 bg-clip-text text-transparent">
                  Your Coding
                </span>
                <br />
                <span className="text-gray-800">Problems Solved</span>
              </h1>
              <p className="text-xl text-gray-600 mt-6 leading-relaxed">
                Stuck on a bug? Need career advice? Connect with experts and get
                the answers you need to accelerate your development journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button className="px-8 py-4 bg-gradient-to-r from-btnColor to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                  Get started today
                </button>
                <button className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-300">
                  Browse Questions
                </button>
              </div>
            </div>

            {/* Right Side (Image) */}
            <div className="lg:w-1/2 flex justify-center mt-12 lg:mt-0">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-3xl blur-2xl transform rotate-6"></div>
                <Image
                  src="/programmer.svg"
                  alt="Knowledge Sharing Illustration"
                  className="relative z-10 max-w-full h-auto drop-shadow-2xl"
                  width={500}
                  height={500}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

