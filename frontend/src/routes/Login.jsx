import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [expiresIn, setExpiresIn] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const auth = urlParams.get("access_token");
    const refresh = urlParams.get("refresh_token");
    const expires = urlParams.get("expires_in");

    if (auth) {
      setAccessToken(auth);
      setRefreshToken(refresh);
      setExpiresIn(expires);

      // Fetch user info and store ID
      fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${auth}` }
      })
      .then(res => res.json())
      .then(data => {
        localStorage.setItem("currentUserId", data.id);
        navigate("/home");  // Redirect as soon as accessToken is present
      });
    }
  }, [navigate]);

  // Early return: if accessToken is present, show nothing and wait for redirect
  if (accessToken) return null;

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
