import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";

const MCQQuiz = ({ lessonId }) => {
  const { user } = useContext(AuthContext);
  const [mcqs, setMcqs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60); // Timer for 1 minute per question

  useEffect(() => {
    const fetchMCQs = async () => {
      try {
        const response = await fetch(`/api/mcqs/${lessonId}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await response.json();
        setMcqs(data.mcqs || []);
      } catch (err) {
        console.error("Error fetching MCQs", err);
      }
    };

    fetchMCQs();
  }, [lessonId, user]);

  useEffect(() => {
    if (mcqs.length > 0) {
      setTimeLeft(60);
    }
  }, [currentIndex, mcqs]);

  useEffect(() => {
    if (timeLeft === 0) {
      moveToNextQuestion(false); // Auto move to the next question if time runs out
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerSelect = (answer) => {
    setUserAnswers({ ...userAnswers, [mcqs[currentIndex]._id]: answer });
  };

  const moveToNextQuestion = (answered = true) => {
    setUserAnswers((prev) => ({
      ...prev,
      [mcqs[currentIndex]._id]: answered ? userAnswers[mcqs[currentIndex]._id] : "Not Done",
    }));
    if (currentIndex < mcqs.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setTimeLeft(60);
    }
  };

  const submitQuiz = () => {
    let correctCount = 0;
    mcqs.forEach((mcq) => {
      if (userAnswers[mcq._id] === mcq.correctAnswer) {
        correctCount++;
      }
    });

    setScore(correctCount);
  };

  if (mcqs.length === 0) return <p className="text-center mt-5">No MCQs available.</p>;

  return (
      <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
        <div className="bg-white shadow-md p-6 rounded-lg w-full max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-green-700">📝 MCQ Quiz</h2>

          {score === null ? (
              <>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">{mcqs[currentIndex].question}</h3>
                  <p className="text-gray-600 text-sm mt-1">Time left: {timeLeft}s</p>
                </div>

                <div className="mt-4 space-y-2">
                  {mcqs[currentIndex].options.map((option, index) => (
                      <button
                          key={index}
                          onClick={() => handleAnswerSelect(option)}
                          className={`block w-full p-3 border rounded-md hover:bg-gray-200 transition ${
                              userAnswers[mcqs[currentIndex]._id] === option ? "bg-green-500 text-white" : ""
                          }`}
                      >
                        {option}
                      </button>
                  ))}
                </div>

                <div className="mt-4 flex justify-between">
                  {currentIndex < mcqs.length - 1 ? (
                      <button
                          onClick={() => moveToNextQuestion(true)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                      >
                        Next Question →
                      </button>
                  ) : (
                      <button
                          onClick={submitQuiz}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                      >
                        Submit Quiz
                      </button>
                  )}
                </div>
              </>
          ) : (
              <p className="mt-4 text-lg font-semibold">
                ✅ Your Score: {score} / {mcqs.length}
              </p>
          )}
        </div>
      </div>
  );
};

export default MCQQuiz;
