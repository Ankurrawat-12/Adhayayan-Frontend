import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AddLesson = () => {
    const { user, token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [topic, setTopic] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [lesson, setLesson] = useState(null);

    const handleGenerateLesson = async () => {
        if (!topic.trim()) {
            setError("Lesson topic is required.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/lessons/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ topic }),
            });

            const data = await response.json();
            console.log("\n\n\n\n")
            if (response.ok) {
                setLesson(data.lesson.content);
                console.log(data.lesson.content)
            } else {
                setError(data.msg || "Failed to generate lesson.");
            }
        } catch (err) {
            console.error("Error generating lesson:", err);
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveLesson = async () => {
        navigate("/dashboard"); // Redirect to dashboard after saving
    };

    return (
        <div className="min-h-screen bg-[#EAE7DC] flex flex-col items-center p-6">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl text-center">
                <h2 className="text-3xl font-bold text-[#E85A4F]">📖 Add a New Lesson</h2>

                {/* Lesson Topic Input */}
                <div className="mt-6">
                    <label className="text-lg font-semibold text-gray-700">Lesson Topic:</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded mt-2"
                        placeholder="Enter a topic (e.g., Python Loops)"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        disabled={loading}
                    />
                </div>

                {/* Generate Lesson Button */}
                <button
                    className="mt-4 bg-[#E85A4F] text-white px-6 py-3 rounded-lg shadow-lg hover:bg-[#E98074] transition"
                    onClick={handleGenerateLesson}
                    disabled={loading}
                >
                    {loading ? "Generating..." : "Generate Lesson"}
                </button>

                {error && <p className="text-red-500 mt-4">{error}</p>}

                {/* Display Generated Lesson */}
                {lesson && (
                    <div className="mt-8 text-left">
                        <h3 className="text-2xl font-semibold text-[#E85A4F]">{lesson.title}</h3>
                        <p className="text-gray-700 mt-2">{lesson.introduction}</p>

                        {/* Ensure lesson.concepts exists before using .map() */}
                        {lesson.concepts && Array.isArray(lesson.concepts) ? (
                            lesson.concepts.map((concept, index) => (
                                <div key={index} className="mt-6">
                                    <h4 className="text-xl font-semibold text-[#E85A4F]">{concept.heading}</h4>
                                    <p className="text-gray-700 mt-2">{concept.explanation}</p>
                                    <p className="text-gray-600 italic mt-2">Example: {concept.example}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-600 mt-4">No concepts available.</p>
                        )}

                        {/* Exercise Section */}
                        {lesson.exercise ? (
                            <div className="mt-6">
                                <h4 className="text-xl font-semibold text-[#E85A4F]">Exercise</h4>
                                <p className="text-gray-700 mt-2">{lesson.exercise.description}</p>
                                <pre className="bg-gray-200 p-4 rounded-md">{lesson.exercise.code}</pre>
                            </div>
                        ) : (
                            <p className="text-gray-600 mt-4">No exercise provided.</p>
                        )}

                        <p className="text-gray-700 mt-8">{lesson.conclusion}</p>

                        {/* Save Lesson Button */}
                        <button
                            className="mt-6 bg-[#E98074] text-white px-6 py-3 rounded-lg shadow-lg hover:bg-[#E85A4F] transition"
                            onClick={() => navigate("/dashboard")}
                        >
                            Save Lesson
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AddLesson;
