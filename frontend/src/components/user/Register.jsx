import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'
import { User, Mail, Lock, AlertCircle, LogIn } from 'lucide-react'
import Cookies from 'js-cookie';
import './Register.css';
import { useGoogleLogin } from "@react-oauth/google";
import axios from 'axios';
import { ArrowLeft ,Chrome } from 'lucide-react';
const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check if password is at least 8 characters
    if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password) ) {
      alert("Password Invalid");
      return;
    }
   //ajax
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${process.env.REACT_APP_BACKENDURL}/register`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) { // Request is complete
        if (xhr.status === 200) { // Check if response is OK
          const response = JSON.parse(xhr.responseText);
          console.log(response);
          if (response.message === "Email Already Exists") {
            setError("Email Already Exists");
          } else if (response.message === "Verification Email Sent To Your Email") {
            setError("Verification Link Sent to your Email");
            console.log('Registration successful:', response);
          }
        } else {
          setError("An error occurred during registration.");
        }
      }
    };
    // Send the request with the form data
    xhr.send(JSON.stringify({ username, email, password }));
  };

  const responsegoogle = async (authtesult) => {
    try {
      console.log(authtesult);
      if (authtesult) {
        const response = await axios.get(`${process.env.REACT_APP_BACKENDURL}/auth/google`, { params: { tokens: authtesult } });
        if (response.data.message) {
          Cookies.set('user', response.data.userId);
          console.log('Registration successful:', response.data);
          navigate("/home");
        }
        console.log(response);
      }
    } catch (error) {
      console.log("error is ", error);
    }
  }

  const googlelogin = useGoogleLogin({
    onSuccess: responsegoogle,
    onError: responsegoogle,
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg"
      >
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-center text-teal-600"
        >
          Please Provide Us With Your Details
        </motion.h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => {setUsername(e.target.value);setError(''); console.log(e.target.value);
                }}
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter your username"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  const value = e.target.value;
                  setEmail(value);
                  setError('');
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
                  if (!emailRegex.test(value)) {
                    setError("Invalid Email");
                  } else {
                    setError(''); // Clear error if valid
                  }
                  console.log(value);
                }}
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter your email"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  const value = e.target.value;
                  setPassword(value);
                  console.log(value);
                  if (value.length < 8) {
                   return  setError("Password must be at least 8 characters long");
                  } else if (!/[a-zA-Z]/.test(value)) {
                    return setError("Password must contain at least one alphabet");
                  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
                    return setError("Password must contain at least one special character");
                  } else {
                    setError("");
                  }
                  console.log(e.target.value);
                }}
                required
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter your password"
              />
            </div>
          </motion.div>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-red-600 flex items-center"
            >
              <AlertCircle className="h-4 w-4 mr-1" />
              {error}
            </motion.p>
          )}

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Register
          </motion.button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        <motion.button
          onClick={googlelogin}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          Sign in with Google
        </motion.button>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm text-center"
        >
          <a 
            href="/login"
            className="font-medium text-teal-600 hover:text-teal-500 flex items-center justify-center"
          >
            <LogIn className="h-4 w-4 mr-1" />
            Login
          </a>
          <a 
            href="/"
            className="font-medium text-teal-600 hover:text-teal-500 flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Home
          </a>
          
        </motion.div>
      </motion.div>
    </div>
  )
};

export default RegisterPage;
