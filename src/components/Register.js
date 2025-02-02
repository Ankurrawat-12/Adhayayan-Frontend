import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Register = () => {
    const { login } = useContext(AuthContext); // Use login to store token
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            // ✅ Instead of redirecting immediately, log the user in
            await login(formData.email, formData.password);

            if (response.ok) {
                navigate("/dashboard"); // Redirect on success
            } else {
                setError(data.msg || "Signup failed");
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-[#EAE7DC] flex items-center justify-center px-4">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-[#E85A4F] text-center">Register</h2>

                {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

                <form onSubmit={handleSubmit} className="mt-4">
                    <label className="block text-gray-700">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        className="w-full p-2 border rounded mt-1"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <label className="block text-gray-700 mt-4">Email</label>
                    <input
                        type="email"
                        name="email"
                        className="w-full p-2 border rounded mt-1"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <label className="block text-gray-700 mt-4">Password</label>
                    <input
                        type="password"
                        name="password"
                        className="w-full p-2 border rounded mt-1"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <label className="block text-gray-700 mt-4">Confirm Password</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        className="w-full p-2 border rounded mt-1"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />

                    <button
                        type="submit"
                        className="w-full bg-[#E85A4F] text-white p-2 rounded mt-4 hover:bg-[#E98074] transition"
                    >
                        Register
                    </button>
                </form>

                <p className="text-center text-gray-700 mt-4">
                    Already have an account? <Link to="/login" className="text-[#E85A4F] underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
