import React, { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const PrivateRoute = () => {
  const { user, token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <p>Loading...</p>; // Prevent flashing redirect

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
