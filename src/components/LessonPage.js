import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import ChatModal from "./ChatModal";

const LessonPage = () => {
    const { lessonId } = useParams();
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [chatOpen, setChatOpen] = useState(false);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const response = await fetch(`/api/lessons/${lessonId}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                const data = await response.json();
                setLesson(data.lesson);
                setProgress(10); // Start progress at 10%
            } catch (err) {
                console.error("Error fetching lesson", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLesson();
    }, [lessonId, user]);

    if (loading) return <p className="text-center mt-5">Loading lesson...</p>;
    if (!lesson) return <p className="text-center text-red-500">Lesson not found.</p>;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
            {/* Back Button */}
            <button
                onClick={() => navigate("/dashboard")}
                className="mb-4 text-blue-600 hover:underline"
            >
                ← Back to Lessons
            </button>

            {/* Progress Bar */}
            <div className="w-full max-w-4xl bg-gray-300 rounded-full h-4 mb-4">
                <div
                    className="bg-green-500 h-4 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            {/* Lesson Content */}
            <div className="w-full max-w-4xl bg-white shadow-md p-6 rounded-lg">
                <h1 className="text-3xl font-bold mb-4">{lesson.title}</h1>

                {/* Introduction */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-green-700">Introduction</h2>
                    <p className="text-gray-700">{lesson.introduction}</p>
                </div>

                {/* Concepts */}
                {lesson.concepts.map((concept, index) => (
                    <div key={index} className="mb-6 bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-green-700">{concept.heading}</h3>
                        <p className="text-gray-700">{concept.explanation}</p>
                        <pre className="bg-gray-800 text-white p-3 rounded-md mt-2">{concept.example}</pre>
                        {/* Update progress on scroll */}
                        <button
                            onClick={() => setProgress((prev) => Math.min(prev + 30, 100))}
                            className="mt-3 text-sm text-blue-600 underline"
                        >
                            Mark as Read
                        </button>
                    </div>
                ))}

                {/* Exercise */}
                <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold text-green-700">Exercise</h2>
                    <p className="text-gray-700">{lesson.exercise.description}</p>
                    <pre className="bg-gray-800 text-white p-3 rounded-md mt-2">{lesson.exercise.code}</pre>
                    {/* Update progress when completed */}
                    <button
                        onClick={() => setProgress(100)}
                        className="mt-3 text-sm text-blue-600 underline"
                    >
                        Mark as Completed
                    </button>
                </div>

                {/* Conclusion */}
                <div className="mt-6">
                    <h2 className="text-xl font-semibold text-green-700">Conclusion</h2>
                    <p className="text-gray-700">{lesson.conclusion}</p>
                </div>
            </div>

            {/* Floating Chat Button */}
            <button
                onClick={() => setChatOpen(true)}
                className="fixed bottom-5 right-5 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition"
            >
                💬 Chat with AI Tutor
            </button>

            {/* AI Tutor Chat Modal */}
            {chatOpen && <ChatModal onClose={() => setChatOpen(false)} />}
        </div>
    );
};

export default LessonPage;
