import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const LessonList = ({ selectedCategory }) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch("/api/lessons", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await response.json();
        setLessons(data.lessons || []);
      } catch (err) {
        console.error("Error fetching lessons", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [user]);

  if (loading) return <p className="text-center mt-5">Loading lessons...</p>;

  // Filter lessons by category
  const filteredLessons =
      selectedCategory === "All"
          ? lessons
          : lessons.filter((lesson) => lesson.topic.includes(selectedCategory));

  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
        {filteredLessons.length === 0 ? (
            <p className="text-gray-500">No lessons found.</p>
        ) : (
            filteredLessons.map((lesson) => (
                <div
                    key={lesson._id}
                    className="bg-white shadow-md p-4 rounded-lg hover:shadow-lg transition"
                >
                  <h3 className="text-lg font-semibold text-green-700">{lesson.topic}</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {lesson.introduction.substring(0, 50)}...
                  </p>
                  <Link
                      to={`/lesson/${lesson._id}`}
                      className="block mt-3 text-blue-600 font-medium hover:underline"
                  >
                    View Lesson →
                  </Link>
                </div>
            ))
        )}
      </div>
  );
};

export default LessonList;
