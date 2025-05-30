import React, { useState, useEffect } from "react";
import "../styles/Login.css";
import { useNavigate, useLocation } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const userId = urlParams.get("userId");

    if (userId) {
      navigate(`/home?userId=${userId}`);
    }
  }, [location, navigate]);


  return (
    <div className="login-container">
      <div className="background-image"></div>
      <div className="login-content">
        <h1>Listen. Share. Vibe.</h1>
        <p>Please sign in with Spotify to continue</p>
        <div className="login-section">
          <button
            className="spotify-button"
            onClick={() => window.location.href = "https://test-spotify-site.local:5050/login"}
          >
            Sign in with Spotify
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;

