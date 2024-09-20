import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import './Register.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
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
      if (response.status === 200 && response.data.message === "Email Already Exists") {
        setError("Email Already Exists");
      }
      if (response.status === 200 && response.data.message === "Account Created Successfully") {
        Cookies.set('user', response.data.userId);
        console.log('Registration successful:', response.data);
        setError("");
        navigate("/home");
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <div className="user-register-container">
      <div className="user-register-form">
        <h2 className="user-register-title">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="user-register-field">
            <label htmlFor="username" className="user-register-label">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="user-register-input"
            />
          </div>
          <div className="user-register-field">
            <label htmlFor="email" className="user-register-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="user-register-input"
            />
          </div>
          <div className="user-register-field">
            <label htmlFor="password" className="user-register-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="user-register-input"
            />
          </div>
          <p className='user-register-error'>{error}</p>
          <button
            type="submit"
            className="user-register-button"
          >
            Register
          </button>
          <Link to="/login" className="user-register-login-link">
            Login
          </Link>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
