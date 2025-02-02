import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="min-h-screen bg-[#EAE7DC] flex flex-col items-center justify-center text-center px-6">

            {/* Main Headline */}
            <h1 className="text-4xl md:text-5xl font-bold text-[#E85A4F] mb-4">
                Learn Python with AI
            </h1>
            <p className="text-lg text-[#8E8D8A] max-w-2xl">
                Master Python in an interactive and engaging way with AI-powered lessons and real-time tutor assistance.
            </p>

            {/* Call-to-Action Button */}
            <Link
                to="/register"
                className="mt-6 bg-[#E98074] text-white px-6 py-3 rounded-lg text-lg shadow-lg hover:bg-[#E85A4F] transition"
            >
                Start Learning
            </Link>

            {/* Key Features Section */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-[#E85A4F]">🧠 AI Tutor</h3>
                    <p className="text-gray-700 mt-2">
                        Get instant explanations and guidance from an AI-powered Python tutor.
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-[#E85A4F]">📚 Interactive Lessons</h3>
                    <p className="text-gray-700 mt-2">
                        Learn with step-by-step explanations and hands-on exercises.
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-[#E85A4F]">✅ Track Your Progress</h3>
                    <p className="text-gray-700 mt-2">
                        Monitor your learning journey with detailed progress tracking.
                    </p>
                </div>
            </div>

            {/* Login / Register Section */}
            <div className="mt-12 bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold text-[#E85A4F] mb-4">Get Started</h2>
                <p className="text-gray-700 mb-4">Log in or create an account to begin your learning journey.</p>
                <div className="flex justify-center space-x-4">
                    <Link
                        to="/login"
                        className="bg-[#E98074] text-white px-4 py-2 rounded-lg hover:bg-[#E85A4F] transition"
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="bg-[#D8C3A5] text-white px-4 py-2 rounded-lg hover:bg-[#8E8D8A] transition"
                    >
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;
