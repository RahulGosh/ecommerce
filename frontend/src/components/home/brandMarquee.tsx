import { motion } from 'framer-motion';

const BrandMarquee = () => {
  return (
    <motion.section 
      className="py-8 bg-gray-50 border-y border-gray-200 overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="relative">
        <div className="flex items-center justify-center space-x-16 animate-marquee whitespace-nowrap">
          {['GUCCI', 'PRADA', 'BALENCIAGA', 'VERSACE', 'DIOR', 'FENDI', 'LOUIS VUITTON'].map((brand, index) => (
            <motion.div 
              key={index}
              className="text-gray-400 font-bold text-xl md:text-2xl tracking-tighter"
              whileHover={{ scale: 1.1, color: "#4f46e5" }}
            >
              {brand}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default BrandMarquee;