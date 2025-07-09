// import { motion } from "framer-motion";
// import hero_img from "../assets/hero_img.png";

// const Hero = () => {
//   const textVariants = {
//     hidden: { opacity: 0, y: 30 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { 
//         duration: 0.9, 
//         ease: [0.6, 0.05, 0.01, 0.9] 
//       }
//     }
//   };

//   const lineVariants = {
//     hidden: { scaleX: 0 },
//     visible: {
//       scaleX: 1,
//       transition: { 
//         duration: 0.8, 
//         ease: "easeOut"
//       }
//     }
//   };

//   const imageVariants = {
//     hidden: { opacity: 0, scale: 1.05 },
//     visible: {
//       opacity: 1,
//       scale: 1,
//       transition: { 
//         duration: 1.2, 
//         ease: [0.6, 0.05, 0.01, 0.9],
//         delay: 0.2 
//       }
//     }
//   };

//   const decorationVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { 
//         duration: 1.5,
//         delay: 0.5
//       }
//     }
//   };

//   return (
//     <div className="relative overflow-hidden">
//       {/* Background decorative elements */}
//       <motion.div 
//         className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0"
//         variants={decorationVariants}
//         initial="hidden"
//         animate="visible"
//       >
//         {/* <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-primary-light/10 blur-3xl"></div> */}
//         {/* <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-accent-light/15 blur-3xl"></div> */}
//       </motion.div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
//         <div className="flex flex-col sm:flex-row items-center bg-gradient-to-r from-neutral-lightest to-neutral-light/30 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl border border-neutral-light/30">
//           {/* Content area */}
//           <motion.div 
//             className="w-full sm:w-1/2 flex items-center justify-center py-12 sm:py-16 px-6 sm:px-12 relative z-10"
//             initial="hidden"
//             animate="visible"
//           >
//             <div className="text-neutral-darkest space-y-6">
//               <motion.div 
//                 className="flex items-center gap-3"
//                 variants={textVariants}
//               >
//                 <motion.div 
//                   className="w-10 md:w-14 h-[2px] bg-primary"
//                   variants={lineVariants}
//                 />
//                 <motion.p 
//                   className="font-medium text-sm md:text-base tracking-wide text-primary-dark"
//                   variants={textVariants}
//                 >
//                   OUR BESTSELLERS
//                 </motion.p>
//               </motion.div>

//               <motion.h1 
//                 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
//                 variants={textVariants}
//               >
//                 Latest <span className="text-primary relative">
//                   Arrivals
//                   <span className="absolute -bottom-2 left-0 w-full h-1 bg-accent/40 rounded-full"></span>
//                 </span>
//               </motion.h1>
              
//               <motion.p
//                 className="text-neutral-dark max-w-md text-sm sm:text-base"
//                 variants={textVariants}
//               >
//                 Discover our curated collection of premium fashion items designed for the modern lifestyle.
//               </motion.p>
              
//               <motion.div 
//                 className="flex items-center gap-4 pt-4"
//                 variants={textVariants}
//               >
//                 <motion.button 
//                   className="px-8 py-3 bg-primary text-white font-medium rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
//                   whileHover={{ scale: 1.03 }}
//                   whileTap={{ scale: 0.98 }}
//                 >
//                   Shop Now
//                 </motion.button>
                
//                 <motion.div 
//                   className="flex items-center gap-3 cursor-pointer group"
//                   whileHover={{ x: 5 }}
//                 >
//                   <motion.p 
//                     className="font-medium text-neutral-dark group-hover:text-primary transition-colors"
//                   >
//                     View Lookbook
//                   </motion.p>
//                   <motion.div 
//                     className="w-6 h-[1px] bg-neutral-dark group-hover:bg-primary group-hover:w-8 transition-all"
//                   />
//                 </motion.div>
//               </motion.div>
//             </div>
//           </motion.div>

//           {/* Image area with decorative elements */}
//           <motion.div 
//             className="w-full sm:w-1/2 relative h-64 sm:h-auto overflow-hidden"
//             initial="hidden"
//             animate="visible"
//           >
//             {/* Decorative shape behind image */}
//             <motion.div 
//               className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-accent/10 rounded-full scale-90"
//               variants={decorationVariants}
//             />
            
//             {/* Decorative circles */}
//             <motion.div 
//               className="absolute top-12 right-12 w-16 h-16 border-2 border-primary/30 rounded-full"
//               variants={decorationVariants}
//             />
//             <motion.div 
//               className="absolute bottom-12 left-1/4 w-8 h-8 border border-accent/40 rounded-full"
//               variants={decorationVariants}
//             />
            
//             {/* Product image */}
//             <motion.div
//               className="relative h-full sm:h-[500px] w-full"
//               variants={imageVariants}
//             >
//               <img 
//                 src={hero_img} 
//                 alt="Latest fashion arrivals" 
//                 className="w-full h-full object-cover object-center"
//               />
              
//               {/* Highlight accent */}
//               <motion.div 
//                 className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-primary/10 to-transparent"
//                 variants={decorationVariants}
//               />
//             </motion.div>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Hero;

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Hero = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.section 
      ref={ref}
      className="relative pt-24 pb-16 md:pt-32 md:pb-24"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center">
        <motion.div 
          className="md:w-1/2 mb-12 md:mb-0 md:pr-12"
          variants={itemVariants}
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            Redefine Your <span className="italic">Style</span>
          </motion.h1>
          
          <motion.p 
            className="text-gray-600 mb-8 leading-relaxed max-w-md text-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Curated collections from top designers. Experience fashion that tells your unique story.
          </motion.p>
          
          <motion.div
            className="flex space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.button 
              className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-8 py-4 rounded-lg relative overflow-hidden group font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10">Shop Collection</span>
              <motion.span 
                className="absolute inset-0 bg-indigo-700 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 mix-blend-multiply"
                initial={{ scaleX: 0 }}
              />
            </motion.button>
            
            <motion.button 
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-medium hover:border-indigo-400 hover:text-indigo-600 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Explore Designers
            </motion.button>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="md:w-1/2 relative"
          variants={itemVariants}
        >
          <motion.div 
            className="aspect-w-3 aspect-h-4 w-full bg-gray-100 overflow-hidden relative rounded-2xl shadow-xl"
            whileHover={{ scale: 0.98 }}
            transition={{ duration: 0.5 }}
          >
            <motion.img 
              src="https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Fashion model" 
              className="object-cover object-center w-full h-full"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <motion.div 
              className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 1.5 }}
            />
          </motion.div>
          
          <motion.div 
            className="absolute -bottom-6 -left-6 bg-white p-6 shadow-xl hidden md:block rounded-lg border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ rotate: -1, scale: 1.05 }}
          >
            <p className="text-sm text-gray-500 font-medium">Featured Collection</p>
            <p className="text-lg font-bold text-indigo-600">Summer '23</p>
          </motion.div>
          
          <motion.div 
            className="absolute -top-6 -right-6 hidden md:block"
            initial={{ opacity: 0, rotate: 45 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="w-24 h-24 bg-gradient-to-r from-amber-200 to-pink-300 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-xs font-bold text-gray-800">-30% Off</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;