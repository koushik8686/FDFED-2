import React from "react";
import {  Verified, Users, Settings } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Verified,
    title: "Verified Users",
    description: "Email verification ensures smooth and spam-free user experiences.",
  },
  {
    icon: Users,
    title: "Verified Sellers",
    description: "All sellers are thoroughly vetted to ensure quality and authenticity.",
  },
  {
    icon: Settings,
    title: "Admin Control",
    description: "Admins have complete control over the platform to manage users and operations.",
  },
 
];

export function Features() {
  return (
    <div
      className="relative py-24"
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1579547944212-c4f4961a8dd8?auto=format&fit=crop&q=80")',
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 bg-white/90 backdrop-blur-md" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Why Choose Hexart?
          </h2>
          <p className="mt-4 text-xl text-gray-700">
            Experience the future of online auctions with our cutting-edge platform.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-80 transition-opacity duration-300" />
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative px-6 py-8 bg-white ring-1 ring-gray-900/10 rounded-xl flex flex-col items-center text-center shadow-lg"
              >
                <feature.icon className="h-12 w-12 text-indigo-600 mb-4 transition-transform group-hover:scale-110" />
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{feature.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
