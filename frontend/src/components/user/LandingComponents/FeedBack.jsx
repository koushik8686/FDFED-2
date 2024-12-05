import React from 'react';
import { motion } from 'framer-motion';

export default function FeedBack() {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            'url("https://plus.unsplash.com/premium_photo-1683134474181-8b88c82b6aa8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZmVlZGJhY2t8ZW58MHx8MHx8fDA%3D")',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-blue-800/70" />
      </div>

      {/* Text and Button Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center px-6 md:px-8"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-2xl md:text-3xl text-gray-100 mb-6 max-w-2xl mx-auto leading-relaxed"
        >
        Take Your Time TO FIll The FeedBack Form 
        </motion.p>
        <a href="/feedback">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-10 py-3 rounded-full text-lg font-medium hover:from-blue-600 hover:to-green-600 transition-all shadow-md hover:shadow-lg"
          >
            Fill the Feedback Form
          </motion.button>
        </a>
      </motion.div>
    </div>
  );
}
