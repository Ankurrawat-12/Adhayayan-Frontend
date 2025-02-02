import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";

const Quiz = () => {
    const { lessonId } = useParams();
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(30);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userAnswers, setUserAnswers] = useState([]);

    // ✅ Fetch Quiz Questions
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`https://adhayayan-backend.onrender.com/api/quiz/${lessonId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();

                if (!data.mcqs || data.mcqs.length === 0) {
                    throw new Error("No quiz available.");
                }

                setQuestions(data.mcqs);
                setUserAnswers(Array(data.mcqs.length).fill(null)); // Initialize answers array
            } catch (err) {
                console.error("Error fetching quiz", err);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [lessonId]);

    // ✅ Timer - Moves to the next question when time runs out
    useEffect(() => {
        if (timer > 0 && !submitted) {
            const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
            return () => clearInterval(interval);
        } else if (timer === 0) {
            handleNextQuestion(false);
        }
    }, [timer, submitted]);

    // ✅ Handle Answer Selection
    const handleAnswerSelection = (answer) => {
        setSelectedAnswer(answer);
    };

    // ✅ Handle Next Question
    const handleNextQuestion = () => {
        let answered = false
        if (!submitted) {
            setSubmitted(true);

            const updatedAnswers = [...userAnswers];
            updatedAnswers[currentQuestionIndex] = selectedAnswer;
            setUserAnswers(updatedAnswers);

            if (selectedAnswer === questions[currentQuestionIndex].correctAnswer) {
                setScore((prevScore) => prevScore + 1);
            }
            answered = true
        }
        if (!answered) {
            setSelectedAnswer(null); // Move to next question without answer
        }
        setTimer(30);
        setSubmitted(false);

        if (currentQuestionIndex + 1 < questions.length) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        } else {
            // ✅ Save answers to localStorage before navigating to results
            localStorage.setItem("userAnswers", JSON.stringify(userAnswers));
            console.log("User answers :- " + userAnswers)
            navigate(`/results/${lessonId}`);
        }
    };

    // ✅ Show Loading State
    if (loading) return <p className="text-center mt-5">Loading quiz...</p>;
    if (!questions.length) return <p className="text-center mt-5 text-red-500">No quiz available.</p>;

    return (
        <div className="min-h-screen bg-[#EAE7DC] flex flex-col items-center p-6">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl text-center">
                <h2 className="text-3xl font-bold text-[#E85A4F]">📝 Quiz</h2>
                <p className="text-gray-700 mt-2">
                    Question {currentQuestionIndex + 1} of {questions.length}
                </p>

                {/* ✅ Timer */}
                <div className="w-full bg-gray-300 rounded-full h-3 mt-4">
                    <div
                        className="bg-[#E85A4F] h-3 rounded-full transition-all ease-linear"
                        style={{ width: `${(timer / 30) * 100}%` }}
                    ></div>
                </div>
                <p className="text-gray-600 mt-1">{timer} seconds remaining</p>

                {/* ✅ Question Display */}
                <div className="mt-6">
                    <h3 className="text-xl font-semibold text-[#E85A4F]">
                        {questions[currentQuestionIndex]?.question}
                    </h3>
                    <div className="mt-4 space-y-3">
                        {questions[currentQuestionIndex]?.options.map((option, index) => (
                            <button
                                key={index}
                                className={`block w-full p-3 rounded-md text-lg transition ${
                                    selectedAnswer === option
                                        ? "bg-[#E98074] text-white"
                                        : "bg-gray-200 text-gray-800"
                                }`}
                                onClick={() => handleAnswerSelection(option)}
                                disabled={submitted}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ✅ Submit Button */}

                    <button
                        className="mt-6 bg-[#E98074] text-white px-6 py-3 rounded-lg shadow-lg hover:bg-[#E85A4F] transition"
                        onClick={() => handleNextQuestion()}
                    >
                        {currentQuestionIndex + 1 < questions.length ? "Next Question" : "Finish Quiz"}
                    </button>
            </div>
        </div>
    );
};

export default Quiz;
