import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import './AdminLogin.css';  // Import the CSS file
import { ArrowBigLeft } from "lucide-react";
export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errormsg, seterrormsg] = useState("");
  const navigate = useNavigate();
  const admin = Cookies.get("admin");

  useEffect(() => {
    if (admin !== undefined) {
      navigate("/admin");
    }
  }, [admin, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKENDURL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.message !== "Login Successfully") {
        seterrormsg(data.message);
      } else {
        Cookies.set("admin", data.admin);
        navigate("/admin");
      }
    } catch (error) {
      seterrormsg(error.message);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <div className="text-center">
          <div className="admin-login-icon-container">
            <div className="admin-login-icon">
              {/* SVG icon */}
              <a style={{textAlign:"center"}} href="/"><ArrowBigLeft/></a>
            </div>
          </div>
          <h2 className="admin-login-title">Admin Login</h2>
          <p className="admin-login-subtitle">Sign in to manage your admin account</p>
        </div>
        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="admin-login-form-group">
            <label htmlFor="email" className="admin-login-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="admin-login-input"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="admin-login-form-group">
            <label htmlFor="password" className="admin-login-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="admin-login-input"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="admin-login-btn">
            Sign in
          </button>
          {errormsg && <p className="admin-login-error-msg">{errormsg}</p>}
        </form>
      </div>
    </div>
  );
}
