import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      navigate("/dashboard"); // Redirect on success
    } catch (err) {
      console.log(err)
      setError(err.message);
    }
  };

  return (
      <div className="min-h-screen bg-[#EAE7DC] flex items-center justify-center px-4">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-[#E85A4F] text-center">Login</h2>

          {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

          <form onSubmit={handleSubmit} className="mt-4">
            <label className="block text-gray-700">Email</label>
            <input
                type="email"
                className="w-full p-2 border rounded mt-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />

            <label className="block text-gray-700 mt-4">Password</label>
            <input
                type="password"
                className="w-full p-2 border rounded mt-1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <button
                type="submit"
                className="w-full bg-[#E85A4F] text-white p-2 rounded mt-4 hover:bg-[#E98074] transition"
            >
              Login
            </button>
          </form>

          <p className="text-center text-gray-700 mt-4">
            Don't have an account? <Link to="/register" className="text-[#E85A4F] underline">Register</Link>
          </p>
        </div>
      </div>
  );
};

export default Login;
