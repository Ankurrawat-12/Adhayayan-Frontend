import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Quiz from "./components/Quiz";
import Lesson from './components/Lesson';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home'
import PrivateRoute from './components/PrivateRoute';
import Dashboard from "./components/Dashboard";
import Results from "./components/Results";
import AddLesson from "./components/AddLesson";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar /> {/* Added Navbar Here */}
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />

                    {/* Protected Routes */}
                    <Route element={<PrivateRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/lessons/:lessonId" element={<Lesson />} />
                        <Route path="/quiz/:lessonId" element={<Quiz />} />
                        <Route path="/results/:lessonId" element={<Results />} />
                        <Route path="/add-lesson" element={<AddLesson />} />

                    </Route>

                    {/* Default Route */}
                    <Route path="/" element={<Login />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
