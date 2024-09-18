import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function Component() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errormsg, seterrormsg] = useState("");
  const navigate = useNavigate();
  const user = Cookies.get("user");

  useEffect(() => {
    if (user!==undefined) {
      navigate("/home");
    }
  }, [user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json(); // Parse the JSON response
      console.log(data);
      if (data.message!=="Login Successfully") {
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
    <div className="flex min-h-[100dvh] items-center justify-center bg-background">
      <div className="mx-auto w-full max-w-md space-y-8 rounded-lg border bg-card p-8 shadow-lg">
        <div className="flex flex-col items-center space-y-2">
          <div className="h-8 w-8 text-primary">
            {/* SVG icon */}
          </div>
          <h2 className="text-2xl font-bold">Welcome to Hexart</h2>
          <p className="text-muted-foreground">Please sign in to your account to continue.</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Link to="/forgot-password" className="text-sm font-medium underline hover:text-primary">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              className="flex h-10 w-full rounded-md border bg-transparent px-3 py-2 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Sign in
          </button>
          { <p className="text-red-500">{errormsg}</p>}
        </form>
        <div className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium underline hover:text-primary">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
