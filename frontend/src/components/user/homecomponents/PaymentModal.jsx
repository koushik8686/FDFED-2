import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PaymentModal = ({ isOpen, onClose, item }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate payment processing
     alert('Payment Successful');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold flex items-center">
              <CreditCard className="w-6 h-6 mr-2" />
              Payment Details
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-4">
            <p className="text-gray-600">Amount to Pay:</p>
            <p className="text-2xl font-bold text-green-600">₹{item.current_price}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Card Number</label>
              <input
                type="text"
                maxLength="16"
                placeholder="1234 5678 9012 3456"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                value={formData.cardNumber}
                onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Card Holder Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                value={formData.cardHolder}
                onChange={(e) => setFormData({ ...formData, cardHolder: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  maxLength="5"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  value={formData.expiry}
                  onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  maxLength="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  value={formData.cvv}
                  onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Pay Now
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentModal;
