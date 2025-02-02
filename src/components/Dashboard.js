import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const { token } = useContext(AuthContext);
    const [lessons, setLessons] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const response = await fetch("https://adhayayan-backend.onrender.com/api/lessons", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                setLessons(data.lessons || []);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching lessons:", err);
                setLoading(false);
            }
        };

        const fetchRecentActivity = async () => {
            try {
                const response = await fetch("https://adhayayan-backend.onrender.com/api/recent-activity", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                setRecentActivity(data.activity || []);
            } catch (err) {
                console.error("Error fetching recent activity:", err);
            }
        };

        fetchLessons();
        fetchRecentActivity();
    }, []);

    const filteredLessons = lessons.filter((lesson) =>
        lesson.topic.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
        <div className="min-h-screen bg-[#EAE7DC] flex flex-col items-center p-6">
            {/* Dashboard Title */}
            <h2 className="text-3xl font-bold text-[#E85A4F] mb-6 flex items-center">
                <span className="mr-2">📚</span> Dashboard
            </h2>

            {/* Search */}
            <div className="w-full max-w-3xl m-4">
                <input
                    type="text"
                    placeholder="🔍 Search lessons..."
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#E85A4F]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Lessons List */}
            <div className="w-full max-w-3xl">
                {loading ? (
                    <p className="text-center text-gray-700">Loading lessons...</p>
                ) : filteredLessons.length === 0 ? (
                    <div className="text-center col-span-full">
                        <p className="text-gray-700 pb-3">No lessons available. Start by creating one!</p>
                        <Link
                            to="/add-lesson"
                            className="mt-4 bg-[#E98074] text-white px-4 py-2 rounded-lg hover:bg-[#E85A4F] transition"
                        >
                            Create Lesson
                        </Link>
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {filteredLessons.map((lesson) => (
                            <li
                                key={lesson._id}
                                className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center"
                            >
                                <div>
                                    <h3 className="text-xl font-semibold text-[#E85A4F]">
                                        {lesson.topic}
                                    </h3>
                                    <p className="text-gray-600">
                                        Created on: {new Date(lesson.createdAt).toLocaleDateString()}
                                    </p>
                                    <p className="text-gray-600">
                                        Progress: <span className="font-bold">{lesson.progress || "0%"}</span>
                                    </p>
                                </div>
                                <Link
                                    to={`/lessons/${lesson._id}`}
                                    className="bg-[#E98074] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#E85A4F] transition"
                                >
                                    View Lesson
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Recent Activity Section */}
            <div className="w-full max-w-3xl mt-8">
                <h3 className="text-xl font-bold text-[#E85A4F] mb-3">📌 Recent Activity</h3>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    {recentActivity.length === 0 ? (
                        <p className="text-gray-600">No recent activity.</p>
                    ) : (
                        <ul className="space-y-2">
                            {recentActivity.map((activity, index) => (
                                <li key={index} className="text-gray-700">
                                    ✅ {activity.message} -{" "}
                                    <span className="text-gray-500 text-sm">
                                        {new Date(activity.timestamp).toLocaleString()}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
