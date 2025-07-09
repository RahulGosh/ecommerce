import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const CategoriesSection = () => {
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
      className="py-16 relative overflow-hidden"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Shop by Category
          </motion.h2>
          <motion.p 
            className="text-gray-600 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Explore our carefully curated collections designed for every occasion and style.
          </motion.p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
        >
          {[
            { 
              name: 'Tops', 
              count: '24 Items', 
              image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
              color: 'from-indigo-500 to-indigo-700'
            },
            { 
              name: 'Bottoms', 
              count: '18 Items', 
              image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
              color: 'from-amber-500 to-amber-700'
            },
            { 
              name: 'Dresses', 
              count: '12 Items', 
              image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680e956?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
              color: 'from-pink-500 to-pink-700'
            },
            { 
              name: 'Outerwear', 
              count: '15 Items', 
              image: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
              color: 'from-emerald-500 to-emerald-700'
            }
          ].map((category, index) => (
            <motion.div 
              key={index}
              className="group relative overflow-hidden h-64 bg-white shadow-md hover:shadow-xl transition duration-300 rounded-xl"
              variants={itemVariants}
              whileHover={{ y: -10 }}
            >
              <motion.div 
                className="absolute inset-0 flex items-end p-6"
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
              >
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="relative z-10 w-full">
                  <div className={`bg-gradient-to-r ${category.color} text-white px-4 py-2 rounded-full inline-block mb-2`}>
                    <span className="text-xs font-bold">{category.count}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white drop-shadow-lg">{category.name}</h3>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
              </motion.div>
              
              <motion.div 
                className="absolute top-4 right-4 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                viewport={{ once: true }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default CategoriesSection;