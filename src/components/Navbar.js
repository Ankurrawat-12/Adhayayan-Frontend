import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="bg-[#EAE7DC] text-[#E85A4F]  w-full top-0 shadow-md z-50">
            <div className="container mx-auto flex justify-between items-center p-4">

                {/* App Title */}

                {user ? (
                    <Link to="/dashboard" className="text-2xl font-bold tracking-wide">
                        Adhayayan
                    </Link>):<Link to="/" className="text-2xl font-bold tracking-wide">
                    Adhayayan
                </Link> }

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-6">
                    <Link
                        to="/add-lesson"
                        className="hover:text-[#E98074] transition"
                    >
                        Create Lesson
                    </Link>
                    <Link
                        to="/dashboard"
                        className="hover:text-[#E98074] transition"
                    >
                        Dashboard
                    </Link>
                    {user && (
                        <button
                            onClick={logout}
                            className="hover:text-[#E98074] transition"
                        >
                            Logout
                        </button>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden text-[#E85A4F] focus:outline-none"
                >
                    ☰
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {menuOpen && (
                <div className="md:hidden bg-[#EAE7DC] p-4">
                    <Link
                        to="/add-lesson"
                        className="block py-2 hover:text-[#E98074]"
                    >
                        Add Lesson
                    </Link>
                    <Link
                        to="/dashboard"
                        className="block py-2 hover:text-[#E98074]"
                    >
                        Dashboard
                    </Link>
                    {user && (
                        <button
                            onClick={logout}
                            className="block w-full text-left py-2 hover:text-[#E98074]"
                        >
                            Logout
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
