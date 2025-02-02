import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import { useParams, Link } from "react-router-dom";
import ChatModal from "./ChatModal"; // Import the ChatModal component

const Lesson = () => {
    const { lessonId } = useParams();
    const { token } = useContext(AuthContext);
    const [lesson, setLesson] = useState(null);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [mcqsExist, setMcqsExist] = useState(false); // ✅ State for checking if MCQs exist
    const [generatingQuiz, setGeneratingQuiz] = useState(false); // ✅ State for loading indicator

    // Fetch Lesson Data
    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const response = await fetch(`/api/lessons/${lessonId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();

                let lessonContent = data.lesson.content;
                if (typeof lessonContent === "string") {
                    try {
                        lessonContent = JSON.parse(lessonContent);
                    } catch (error) {
                        console.error("Error parsing lesson content", error);
                    }
                }

                setLesson({ ...data.lesson, content: lessonContent });
                setLoading(false);
            } catch (err) {
                console.error("Error fetching lesson", err);
                setLoading(false);
            }
        };

        fetchLesson();
    }, [lessonId]);

    // ✅ Check if MCQs already exist for this lesson
    useEffect(() => {
        const checkForMCQs = async () => {
            try {
                const response = await fetch(`/api/quiz/${lessonId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();

                if (data.mcqs && data.mcqs.length > 0) {
                    setMcqsExist(true);
                }
            } catch (err) {
                console.error("Error checking for MCQs:", err);
            }
        };

        checkForMCQs();
    }, [lessonId]);

    // ✅ Function to Generate MCQs
    const generateMCQs = async () => {
        setGeneratingQuiz(true);

        try {
            const response = await fetch("/api/quiz/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ lessonId }),
            });

            const data = await response.json();
            console.log("MCQ Generation Response:", data);

            if (response.ok) {
                setMcqsExist(true); // ✅ MCQs now exist
            } else {
                alert(data.msg || "Failed to generate MCQs.");
            }
        } catch (err) {
            console.error("Error generating MCQs:", err);
            alert("Error generating MCQs.");
        }

        setGeneratingQuiz(false);
    };

    // ✅ Scroll Progress Tracking
    useEffect(() => {
        const handleScroll = () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollTop = window.scrollY;
            const progressPercentage = (scrollTop / scrollHeight) * 100;
            setProgress(progressPercentage);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (loading) return <p className="text-center mt-5">Loading lesson...</p>;
    if (!lesson) return <p className="text-center mt-5">Lesson not found.</p>;

    return (
        <div className="min-h-screen bg-[#EAE7DC] flex flex-col items-center p-6 relative">
            {/* Progress Bar */}
            <div className="w-full fixed top-0 left-0 h-2 bg-[#E85A4F]" style={{ width: `${progress}%` }}></div>

            {/* Lesson Content */}
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl text-center">
                <h2 className="text-3xl font-bold text-[#E85A4F]">{lesson.content.title}</h2>
                <p className="text-gray-700 mt-4">{lesson.content.introduction}</p>

                {lesson.content.concepts && lesson.content.concepts.map((concept, index) => (
                    <div key={index} className="mt-6 text-left">
                        <h3 className="text-xl font-semibold text-[#E85A4F]">{concept.heading}</h3>
                        <p className="text-gray-700 mt-2">{concept.explanation}</p>
                        <p className="text-gray-600 italic mt-2">Example: {concept.example}</p>
                    </div>
                ))}

                {/* Exercise Section */}
                <div className="mt-8 text-left">
                    <h3 className="text-xl font-semibold text-[#E85A4F]">Exercise</h3>
                    <p className="text-gray-700 mt-2">{lesson.content.exercise.description}</p>
                    <pre className="bg-gray-200 p-4 rounded-md mt-2 text-left">{lesson.content.exercise.code}</pre>
                </div>

                {/* Conclusion */}
                <p className="text-gray-700 mt-8">{lesson.content.conclusion}</p>
            </div>

            {/* Floating Chat Button */}
            <button
                className="fixed bottom-6 right-6 bg-[#E85A4F] text-white px-4 py-3 rounded-full shadow-lg hover:bg-[#E98074] transition"
                onClick={() => setIsChatOpen(true)}
            >
                💬 AI Tutor
            </button>

            {/* Chat Modal on Right Side */}
            {isChatOpen && <ChatModal onClose={() => setIsChatOpen(false)} lesson={lesson}/>}

            {/* Quiz Button */}
            <button
                onClick={mcqsExist ? () => window.location.href = `/quiz/${lessonId}` : generateMCQs}
                className="mt-8 bg-[#E98074] text-white px-6 py-3 rounded-lg shadow-lg hover:bg-[#E85A4F] transition"
                disabled={generatingQuiz}
            >
                {generatingQuiz ? "Generating..." : mcqsExist ? "Start Quiz" : "Generate Homework"}
            </button>
        </div>
    );
};

export default Lesson;
