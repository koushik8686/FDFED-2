import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

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
      const response = await fetch("/admin/login", {
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
        Cookies.set("admin", data.userId);
        navigate("/admin");
      }
    } catch (error) {
      seterrormsg(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-50 to-blue-100 p-6">
      <div className="mx-auto w-full max-w-lg space-y-8 rounded-lg bg-white p-8 shadow-2xl">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
              {/* SVG icon */}
              <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Admin Login</h2>
          <p className="text-sm text-gray-500">Sign in to manage your admin account</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 py-2 px-4 text-white font-semibold shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Sign in
          </button>
          {errormsg && <p className="mt-2 text-center text-sm text-red-500">{errormsg}</p>}
        </form>
        <div className="text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
