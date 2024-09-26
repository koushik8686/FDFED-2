import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Register.css';
import { useGoogleLogin } from "@react-oauth/google";
import axios from 'axios';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if password is at least 8 characters
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/register', true);
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
        const response = await axios.get(`http://localhost:4000/auth/google`, { params: { tokens: authtesult } });
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
    <div className="user-register-container">
      <div className="user-register-form">
        <h2 className="user-register-title">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="user-register-field">
            <label htmlFor="username" className="user-register-label">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="user-register-input"
            />
          </div>
          <div className="user-register-field">
            <label htmlFor="email" className="user-register-label">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="user-register-input"
            />
          </div>
          <div className="user-register-field">
            <label htmlFor="password" className="user-register-label">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) =>{
                if (e.target.value.length < 8) {
                  setError("PLease Ennter a password of atleast 8 characters")
                } else{
                  setError("")
                }
                setPassword(e.target.value)}}
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
          <button
            onClick={googlelogin}
            className=" google-login-button"
          >
            Sign in with Google
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
