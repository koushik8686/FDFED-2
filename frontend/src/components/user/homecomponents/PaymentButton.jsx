import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PaymentModal from './PaymentModal';

const PaymentButton = ({ item }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setIsModalOpen(true)}
        className="payment-button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Pay ₹{item.current_price}
      </motion.button>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={item}
      />
    </>
  );
};

export default PaymentButton;
