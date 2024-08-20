import React, { useState ,useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

export default function SellerAuth() {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const seller = Cookies.get('seller');
  const [serverMessage, setServerMessage] = useState(''); // State to store server message
  const navigate = useNavigate()
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setServerMessage(''); // Clear server message when switching tabs
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = activeTab === 'login' 
      ? '/sellerlogin' 
      : '/sellerregister';

    const body = activeTab === 'login' 
      ? { email: formData.email, password: formData.password } 
      : formData;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      console.log(response)
      setServerMessage(result.message); // Set server message

      if (response.ok) {
        // Handle success
        if (result.message === "Account Created Successfully" || result.message === "Login Successfully") {
          // Store sellerId in a cookie
          Cookies.set('seller', result.sellerId, { expires: 7 }); // Expires in 7 days
          navigate("/sellerhome")
        }
        console.log('Success:', result);
      } else {
        // Handle error
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      setServerMessage('An error occurred. Please try again.');
      console.error('Fetch error:', error);
    }
  };
  useEffect(() => {
    if (seller!==undefined) {
      navigate("/sellerhome");
    }
  }, [seller, navigate]);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center space-y-6 rounded-2xl bg-white p-8 shadow-xl">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-800">Welcome to HexArt</h1>
          <p className="text-gray-600">Sign in to your account or create a new one</p>
        </div>
        <div className="w-full">
          <div className="grid w-full grid-cols-2 mb-4">
            <button
              className={`py-2 px-4 text-center font-semibold transition-colors duration-300 ${
                activeTab === 'login' ? 'border-b-4 border-red-500 text-red-500' : 'text-gray-600'
              }`}
              onClick={() => handleTabSwitch('login')}
            >
              Login
            </button>
            <button
              className={`py-2 px-4 text-center font-semibold transition-colors duration-300 ${
                activeTab === 'register' ? 'border-b-4 border-red-500 text-red-500' : 'text-gray-600'
              }`}
              onClick={() => handleTabSwitch('register')}
            >
              Register
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {activeTab === 'register' && (
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Jared Palmer"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            {activeTab === 'register' && (
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="123-456-7890"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            )}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300"
            >
              {activeTab === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>
          {serverMessage && (
            <p className="mt-4 text-center text-sm font-semibold text-red-500">
              {serverMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
