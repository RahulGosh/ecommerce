// import React from "react";

// const NewsletterBox = () => {

//   const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//   }

//   return (
//     <div className="text-center flex flex-col items-center justify-center h-full">
//       <p className="text-2xl font-medium text-gray-800">
//         Subscribe now & get 20% off
//       </p>
//       <p className="text-gray-400 mt-3">
//         Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea, corporis.
//       </p>

//       <form onSubmit={onSubmitHandler} className="w-full sm:w-1/2 flex items-center gap-3 my-6 border pl-3 rounded-lg">
//         <input
//           type="email"
//           placeholder="Enter your email"
//           className="w-full sm:flex-1 outline-none p-2"
//           required
//         />
//         <button
//           type="submit"
//           className="bg-black text-white text-xs px-10 py-4"
//         >
//           SUBSCRIBE
//         </button>
//       </form>
//     </div>
//   );
// };

// export default NewsletterBox;


import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const NewsletterSection = () => {
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
      className="py-16 bg-gradient-to-br from-indigo-50 to-pink-50 relative overflow-hidden"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="max-w-4xl mx-auto px-6 text-center relative">
        <motion.div 
          className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-indigo-200 opacity-20 mix-blend-multiply filter blur-xl"
          animate={{
            x: [0, 20, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-pink-200 opacity-20 mix-blend-multiply filter blur-xl"
          animate={{
            x: [0, -20, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.div variants={itemVariants}>
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
            Join Our Community
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Subscribe to get exclusive offers, style tips, and early access to new collections.
          </p>
        </motion.div>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          variants={itemVariants}
        >
          <input 
            type="email" 
            placeholder="Your email address" 
            className="flex-grow px-6 py-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent rounded-lg shadow-sm" 
          />
          <motion.button 
            className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-8 py-4 rounded-lg font-bold shadow-md hover:shadow-lg transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Subscribe
          </motion.button>
        </motion.div>
        
        <motion.p 
          className="text-xs text-gray-500 mt-4"
          variants={itemVariants}
        >
          We respect your privacy. Unsubscribe at any time.
        </motion.p>
      </div>
    </motion.section>
  );
};

export default NewsletterSection;