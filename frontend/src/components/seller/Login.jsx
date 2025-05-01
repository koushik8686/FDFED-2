import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Login.css';
import { ArrowBigLeft } from 'lucide-react';
export default function SellerAuth() {
  const [activeTab, setActiveTab] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const seller = Cookies.get('seller');
  const [serverMessage, setServerMessage] = useState('');
  const navigate = useNavigate();

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setServerMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate password and phone number before sending
    if (activeTab === 'register') {
      if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        alert("Invalid password. Ensure it meets the criteria.");
        return; // Prevent submission
      }
      if (phone.length !== 10 || !/^\d+$/.test(phone)) {
        alert("Phone number must be exactly 10 digits.");
        return; // Prevent submission
      }
    }
    const url = activeTab === 'login' ? `${process.env.REACT_APP_BACKENDURL}/sellerlogin` : `${process.env.REACT_APP_BACKENDURL}/sellerregister`;
    const body = activeTab === 'login'
      ? { email, password }
      : { name, email, password, phone };
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

  useEffect(() => {
    if (seller !== undefined) {
      navigate("/sellerhome");
    }
  }, [seller]);

  return (
    <div className="seller-login-container">
      <div className="seller-login-box">
        <div className="seller-login-header">
          <h1 className="seller-login-title"> <a style={{textAlign:"center"}} href="/"><ArrowBigLeft/></a> Welcome to HexArt</h1>
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
                value={name}
                onChange={(e) => {setName(e.target.value); console.log(e.target.value);setServerMessage('')}}
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
              value={email}
              onChange={(e) => {
                const value = e.target.value;
                setEmail(value);
                console.log(value);
                setServerMessage('');
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
                if (!emailRegex.test(value)) {
                  setServerMessage("Invalid email format");
                }
              }}
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
              value={password}
              onChange={(e) => {
                const value = e.target.value;
                setPassword(value);
                if (activeTab === "register") {  
                if (value.length < 8) {
                 return setServerMessage("Password must be at least 8 characters long");
                } else if (!/[a-zA-Z]/.test(value)) { // Check for at least one letter
                  return setServerMessage("Password must contain at least one letter");
                } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) { // Check for at least one special character
                  return setServerMessage("Password must contain at least one special character");
                } else {
                  setServerMessage("");
                }
                console.log(e.target.value);
                setServerMessage('')
              } else{
                setPassword(value)
              }}
            }
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
                placeholder="1234567890"
                value={phone}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length !== 10 || !/^\d+$/.test(value)) { // Check for exactly 10 digits
                    setServerMessage("Phone number must be exactly 10 digits");
                  } else {
                    setServerMessage("");
                  }
                 console.log(e.target.value);
                  setPhone(value);
                }}
                required
                className="seller-login-input"
              />
            </div>
          )}
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
