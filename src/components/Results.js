import React, {useContext, useEffect, useState} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import AuthContext from "../context/AuthContext";

ChartJS.register(ArcElement, Tooltip, Legend);

const Results = () => {
    const { lessonId } = useParams();
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [score, setScore] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const userAnswers = JSON.parse(localStorage.getItem("userAnswers")) || [];
                if (!userAnswers.length) {
                    throw new Error("No quiz data found.");
                }

                const response = await fetch(`https://adhayayan-backend.onrender.com/api/results/${lessonId}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ userAnswers }),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();


                console.log("Results :- "+ data)

                setScore(data.correctAnswers);
                setTotalQuestions(data.totalQuestions);
                setAnswers(data.answers);
            } catch (err) {
                console.error("Error fetching results:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [lessonId]);

    if (loading) return <p className="text-center mt-5">Loading results...</p>;

    const chartData = {
        labels: ["Correct", "Incorrect"],
        datasets: [
            {
                data: [score, totalQuestions - score],
                backgroundColor: ["#4CAF50", "#E85A4F"],
                hoverBackgroundColor: ["#45A049", "#E98074"],
            },
        ],
    };

    return (
        <div className="min-h-screen bg-[#EAE7DC] flex flex-col items-center p-6">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl text-center">
                <h2 className="text-3xl font-bold text-[#E85A4F]">📊 Quiz Results</h2>
                <p className="text-lg text-gray-700 mt-4">
                    You scored <span className="text-[#E85A4F] font-bold">{score}</span> out of{" "}
                    <span className="font-bold">{totalQuestions}</span>.
                </p>

                <div className="mt-6 w-64 h-64 mx-auto">
                    <Pie data={chartData} />
                </div>

                <div className="mt-8 text-left">
                    <h3 className="text-xl font-semibold text-[#E85A4F]">Review Your Answers</h3>
                    <ul className="mt-4 space-y-4">
                        {answers.map((answer, index) => (
                            <li
                                key={index}
                                className={`p-4 rounded-md ${
                                    answer.isCorrect ? "bg-green-100" : "bg-red-100"
                                }`}
                            >
                                <p className="font-semibold">{answer.question}</p>
                                <p>
                                    <strong>Your Answer:</strong> {answer.userAnswer}
                                </p>
                                <p>
                                    <strong>Correct Answer:</strong> {answer.correctAnswer}
                                </p>
                                {!answer.isCorrect && (
                                    <p className="mt-2 text-gray-700">
                                        <strong>Explanation:</strong> {answer.explanation}
                                    </p>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flex gap-2 justify-center">
                    <button
                        className="mt-8 bg-[#E85A4F] text-white px-6 py-3 rounded-lg shadow-lg hover:bg-[#E98074] transition"
                        onClick={() => navigate(`/quiz/${lessonId}`)}
                    >
                        Retry Quiz
                    </button>
                    <button
                        className="mt-8 bg-[#E85A4F] text-white px-6 py-3 rounded-lg shadow-lg hover:bg-[#E98074] transition"
                        onClick={() => navigate(`/dashboard`)}
                    >
                        Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Results;
