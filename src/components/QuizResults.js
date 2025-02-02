import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import AuthContext from "../context/AuthContext";

Chart.register(ArcElement, Tooltip, Legend);

const QuizResults = ({ results, lessonId }) => {
    const { user } = useContext(AuthContext);
    const [explanations, setExplanations] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExplanations = async () => {
            const wrongAnswers = results.filter((q) => q.isCorrect === false);
            if (wrongAnswers.length === 0) return;

            try {
                const response = await fetch("/api/explanations", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                    body: JSON.stringify({ questions: wrongAnswers.map((q) => q.question) }),
                });

                const data = await response.json();
                setExplanations(data.explanations || {});
            } catch (err) {
                console.error("Error fetching explanations:", err);
            }
        };

        fetchExplanations();
    }, [results, user]);

    const correctCount = results.filter((q) => q.isCorrect).length;
    const incorrectCount = results.length - correctCount;

    const chartData = {
        labels: ["Correct", "Incorrect"],
        datasets: [
            {
                data: [correctCount, incorrectCount],
                backgroundColor: ["#10B981", "#EF4444"],
                hoverBackgroundColor: ["#047857", "#B91C1C"],
            },
        ],
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
            <div className="bg-white shadow-md p-6 rounded-lg w-full max-w-3xl text-center">
                <h2 className="text-2xl font-bold text-green-700">📊 Quiz Results</h2>
                <p className="text-lg font-semibold mt-2">Your Score: {correctCount} / {results.length}</p>

                {/* Performance Chart */}
                <div className="mt-6 w-64 mx-auto">
                    <Doughnut data={chartData} />
                </div>

                {/* Answer List */}
                <div className="mt-6">
                    <h3 className="text-xl font-semibold text-gray-800">Answers Summary</h3>
                    <ul className="mt-4 space-y-4">
                        {results.map((q, index) => (
                            <li
                                key={index}
                                className={`p-4 rounded-md shadow-sm ${
                                    q.isCorrect ? "bg-green-100" : "bg-red-100"
                                }`}
                            >
                                <p className="text-gray-800 font-semibold">{q.question}</p>
                                <p className="mt-2">
                                    <span className="font-medium">Your Answer:</span>{" "}
                                    {q.userAnswer || "Not Answered"}
                                </p>
                                <p>
                                    <span className="font-medium">Correct Answer:</span>{" "}
                                    {q.correctAnswer}
                                </p>
                                {!q.isCorrect && explanations[q.question] && (
                                    <p className="mt-2 text-gray-700">
                                        <span className="font-medium">Explanation:</span> {explanations[q.question]}
                                    </p>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Buttons */}
                <div className="mt-6 flex justify-between">
                    <button
                        onClick={() => navigate(`/lesson/${lessonId}`)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        📖 Review Lesson
                    </button>
                    <button
                        onClick={() => navigate(`/quiz/${lessonId}`)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                        🔄 Retry Quiz
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizResults;
