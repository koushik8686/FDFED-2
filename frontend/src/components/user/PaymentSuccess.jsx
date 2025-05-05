import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100"
    >
      <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
      <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-gray-600 mb-8">Your transaction has been completed.</p>
      <Link
        to="/myitems"
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
      >
        View My Items
      </Link>
    </motion.div>
  );
};

export default PaymentSuccess;
