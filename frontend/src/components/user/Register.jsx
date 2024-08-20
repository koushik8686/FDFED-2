import React, { useState } from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie'

const RegisterPage = () => {
  const navigate = useNavigate();
  const [error , seterror] = useState("");
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/register', formData);
      // Handle successful registration here, e.g., redirect to login page
      if (response.status === 200 && response.data.message == "Email Already Exists"){
        seterror("Email Already Exists")
    }
      if (response.status === 200  && response.data.message == "Account Created Successfully") {
        Cookies.set('user' , response.data.userId)
        console.log('Registration successful:', response.data);
        seterror("")
        navigate("/home")
      } 
    } catch (error) {
      console.error('Error during registration:', error);
      // Handle error here, e.g., show an error message
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <p className='m-3 text-center' style={{color:"red"}}>{error}</p>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Register
          </button>
          <Link to="/login" className="block mt-4 text-center text-indigo-600 hover:text-indigo-800">
            Login
          </Link>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
