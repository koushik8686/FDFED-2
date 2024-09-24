import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Login.css';
import { useGoogleLogin } from "@react-oauth/google";
import {jwtDecode} from "jwt-decode";
import axios from 'axios';

export default function SellerAuth() {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const seller = Cookies.get('seller');
  const [serverMessage, setServerMessage] = useState('');
  const navigate = useNavigate();

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setServerMessage('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = activeTab === 'login' ? '/sellerlogin' : '/sellerregister';
    const body = activeTab === 'login' ? { email: formData.email, password: formData.password } : formData;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      setServerMessage(result.message);

      if (response.ok) {
        if (result.message === "Account Created Successfully" || result.message === "Login Successfully") {
          Cookies.set('seller', result.sellerId, { expires: 7 });
          navigate("/sellerhome");
        }
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      setServerMessage('An error occurred. Please try again.');
      console.error('Fetch error:', error);
    }
  };
  // Google Login Error Handler
  const responsegoogle = async(authtesult)=>{
    try {
      console.log(authtesult);
      if (authtesult) {
        const response = await axios.get(`http://localhost:4000/seller/auth/google`, {params:{tokens: authtesult}});
        console.log(response);
      }
    } catch (error) {
      console.log("error is " , error);
    }
}
const googlelogin = useGoogleLogin({
  onSuccess:responsegoogle,
  onError:responsegoogle,
})

  useEffect(() => {
    if (seller !== undefined) {
      navigate("/sellerhome");
    }
  }, [seller, navigate]);

  return (
    <div className="seller-login-container">
      <div className="seller-login-box">
        <div className="seller-login-header">
          <h1 className="seller-login-title">Welcome to HexArt</h1>
          <p className="seller-login-subtitle">Sign in to your account or create a new one</p>
        </div>
        <div className="seller-login-tabs">
          <button
            className={`seller-login-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('login')}
          >
            Login
          </button>
          <button
            className={`seller-login-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('register')}
          >
            Register
          </button>
        </div>
        <form className="seller-login-form" onSubmit={handleSubmit}>
          {activeTab === 'register' && (
            <div className="seller-login-field">
              <label htmlFor="name" className="seller-login-label">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Jared Palmer"
                value={formData.name}
                onChange={handleChange}
                required
                className="seller-login-input"
              />
            </div>
          )}
          <div className="seller-login-field">
            <label htmlFor="email" className="seller-login-label">Email</label>
            <input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="seller-login-input"
            />
          </div>
          <div className="seller-login-field">
            <label htmlFor="password" className="seller-login-label">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="seller-login-input"
            />
          </div>
          {activeTab === 'register' && (
            <div className="seller-login-field">
              <label htmlFor="phone" className="seller-login-label">Phone</label>
              <input
                id="phone"
                type="tel"
                placeholder="123-456-7890"
                value={formData.phone}
                onChange={handleChange}
                required
                className="seller-login-input"
              />
            </div>
          )}
          <a href="">Forgot Password</a>
          <button
            type="submit"
            className="seller-login-button"
          >
            {activeTab === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        {serverMessage && (
          <p className="seller-login-message">
            {serverMessage}
          </p>
        )}
      </div>
    </div>
  );
}
