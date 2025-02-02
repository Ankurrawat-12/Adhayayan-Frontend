import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const login = async (email, password) => {
    try {
      const response = await fetch("https://adhayayan-backend.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);
      setToken(data.token);
    } catch (error) {
      throw new Error(`Login Error: ${error.message}`);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken("");
  };

  // ✅ Ensure user state persists after page reload
  useEffect(() => {
    if (token) {
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
          .then((res) => res.json())
          .then((data) => {
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user)); // ✅ Save updated user info
          })
          .catch(() => logout());
    }
  }, [token]);

  return (
      <AuthContext.Provider value={{ user, login, logout, token }}>
        {children}
      </AuthContext.Provider>
  );
};

export default AuthContext;
