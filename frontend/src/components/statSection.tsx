import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const StatsSection = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  const stats = [
    { value: '10K+', label: 'Happy Customers' },
    { value: '200+', label: 'Brand Partners' },
    { value: '98%', label: 'Positive Reviews' },
    { value: '24/7', label: 'Customer Support' }
  ];

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
      className="py-16 bg-gradient-to-r from-indigo-600 to-pink-500 text-white"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          variants={containerVariants}
        >
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              className="p-6"
              variants={itemVariants}
            >
              <motion.p 
                className="text-4xl font-bold mb-2"
                whileHover={{ scale: 1.1 }}
              >
                {stat.value}
              </motion.p>
              <p className="text-indigo-100">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default StatsSection;