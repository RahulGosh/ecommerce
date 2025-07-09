// import { assets } from "../assets/assets";

// const Footer = () => {
//   return (
//     <div>
//       <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40  text-sm">
//         <div>
//           <img src={assets.logo} alt="" className="mb-5 w-32" />
//           <p className="w-full md:w-2/3 text-gray-600">
//             Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit
//             accusamus eveniet voluptatem atque ducimus possimus!
//           </p>
//         </div>

//         <div>
//           <p className="text-xl font-medium mb-5">COMPANY</p>
//           <ul className="flex flex-col gap-1 text-gray-600">
//             <li>Home</li>
//             <li>About Us</li>
//             <li>Delivery</li>
//             <li>Privacy Policy</li>
//           </ul>
//         </div>

//         <div>
//           <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
//           <ul className="flex flex-col gap-1 text-gray-600">
//             <li>+1-212-456-7911</li>
//             <li>contact@foreveryou.com</li>
//           </ul>
//         </div>
//       </div>

//       <div>
//         <hr />
//         <p className="py-5 text-sm text-center">
//           Copyright 2024@ forever.com - All Right Reserved.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Footer;


// components/common/Footer.jsx
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer 
      className="bg-white border-t border-gray-200 py-12"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <motion.h3 
              className="text-xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              STYLEHUB
            </motion.h3>
            <p className="text-gray-600 mb-4">
              Elevate your style with our curated collections.
            </p>
            <div className="flex space-x-4">
              {['facebook', 'twitter', 'instagram', 'pinterest'].map((social, idx) => (
                <motion.a 
                  key={idx}
                  href="#"
                  className="text-gray-400 hover:text-indigo-600"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="sr-only">{social}</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10c0-5.523-4.477-10-10-10z" />
                  </svg>
                </motion.a>
              ))}
            </div>
          </div>
          
          {/* Navigation columns */}
          {[
            {
              title: 'Shop',
              links: ['All Products', 'New Arrivals', 'Best Sellers', 'Sale Items']
            },
            {
              title: 'Company',
              links: ['About Us', 'Careers', 'Press', 'Sustainability']
            },
            {
              title: 'Support',
              links: ['Contact Us', 'FAQs', 'Shipping', 'Returns']
            }
          ].map((column, idx) => (
            <div key={idx}>
              <h3 className="font-bold text-gray-900 mb-4">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <motion.a 
                      href="#" 
                      className="text-gray-600 hover:text-indigo-600"
                      whileHover={{ x: 5 }}
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-200 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © 2023 STYLEHUB. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-sm text-gray-500 hover:text-indigo-600">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-indigo-600">Terms of Service</a>
            <a href="#" className="text-sm text-gray-500 hover:text-indigo-600">Cookie Policy</a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;