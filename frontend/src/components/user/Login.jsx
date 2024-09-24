import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useGoogleLogin } from "@react-oauth/google";
import './Login.css'
export default function Component() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errormsg, seterrormsg] = useState("");
  const navigate = useNavigate();
  const user = Cookies.get("user");
  useEffect(() => {
    if (user !== undefined) {
      navigate("/home");
    }
  }, [user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json(); // Parse the JSON response
      console.log(data);
      if (data.message !== "Login Successfully") {
        seterrormsg(data.message);
      } else {
        console.log(data);
        Cookies.set("user", data.userId);
        navigate("/home");
      }
    } catch (error) {
      seterrormsg(error.message);
    }
  };

  return (
  <>
    <div className="user-login-container">
      <div className="user-login-box">
        <div className="user-login-header">
          <div className="user-login-icon">
            {/* SVG icon */}
          </div>
          <h2 className="user-login-title">Welcome to Hexart</h2>
          <p className="user-login-subtitle">Please sign in to your account to continue.</p>
        </div>
        <form className="user-login-form" onSubmit={handleSubmit}>
          <div className="user-login-input-group">
            <label htmlFor="email" className="user-login-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="user-login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="user-login-input-group">
            <div className="user-login-label-group">
              <label htmlFor="password" className="user-login-label">
                Password
              </label>
            </div>
            <input
              id="password"
              type="password"
              className="user-login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="user-login-button"
          >
            Sign in
          </button>
          { <p className="user-login-error">{errormsg}</p>}
        </form>
        <div className="user-login-footer">
          Don't have an account?{" "}
          <Link to="/register" className="user-login-register-link">
            Register
          </Link>
        </div>
      </div>
    </div>
  </>
  );
}
