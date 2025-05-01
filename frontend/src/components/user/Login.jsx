import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useGoogleLogin } from "@react-oauth/google";
import './Login.css';
import axios from "axios";
import { ArrowLeft } from "lucide-react";

export default function Component() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errormsg, seterrormsg] = useState("");
  const navigate = useNavigate();
  const user = Cookies.get("user");
  console.log(process.env.REACT_APP_BACKENDURL);
  useEffect(() => {
    if (user !== undefined) {
      navigate("/home");
    }
  }, [user, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${process.env.REACT_APP_BACKENDURL}/login`, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        const data = JSON.parse(xhr.responseText);
        console.log(data);
        if (xhr.status === 200 && data.message === "Login Successfully") {
          Cookies.set("user", data.userId);
          navigate("/home");
        } else {
          seterrormsg(data.message);
        }
      }
    };
    xhr.onerror = function () {
      seterrormsg("An error occurred during the login process.");
    };
    xhr.send(JSON.stringify({ email, password }));
  };

  const responseGoogle = async (authResult) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKENDURL}/auth/google`, {
        params: { tokens: authResult }
      });
      if (response.status === 200) {
        Cookies.set("user", response.data.userId);
        console.log("Google login successful:", response.data);
        navigate("/home");
      }
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  const googlelogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
  });

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black">
        <div className="absolute top-4 left-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-white hover:text-gray-300 transition duration-150 ease-in-out"
          >
            <ArrowLeft className="h-6 w-6" />
            <span className="ml-2 text-lg">Back</span>
          </button>
        </div>
        <div className="w-full max-w-md p-8 space-y-8 bg-gradient-to-b from-white to-gray-200 rounded-2xl shadow-2xl">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-gray-900">Welcome to Hexart</h2>
            <p className="mt-2 text-sm text-gray-600">Please sign in to your account to continue.</p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:z-10 text-lg"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    seterrormsg("");
                    console.log(e.target.value);
                  }}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:z-10 text-lg"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    seterrormsg("");
                    console.log(e.target.value);
                  }}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out"
              >
                Sign in
              </button>
            </div>
          </form>

          {errormsg && <p className="mt-2 text-center text-sm text-red-600">{errormsg}</p>}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={googlelogin}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-lg font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out"
              >
                <svg className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
                </svg>
                Sign in with Google
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/register" className="font-medium text-purple-600 hover:text-purple-500 transition duration-150 ease-in-out">
              Register
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
