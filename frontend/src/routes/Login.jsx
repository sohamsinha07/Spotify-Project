import React, { useState, useEffect } from "react";
import "../styles/Login.css"; // for the background styling

function Login() {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [expiresIn, setExpiresIn] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const auth = urlParams.get("access_token");
    const refresh = urlParams.get("refresh_token");
    const expires = urlParams.get("expires_in");

    if (auth) {
      setAccessToken(auth);
      setRefreshToken(refresh);
      setExpiresIn(expires);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  function handleSignOut() {
    setAccessToken(null);
    setRefreshToken(null);
    setExpiresIn(null);
    window.location.href = "/";
  }

  return (
    <div className="login-container">
      <div className="background-image"></div>
      <div className="login-content">
        <h1>Listen. Share. Vibe.</h1>
        <p>Please sign in with Spotify to continue</p>

        {accessToken ? (
          <div className="logged-in-section">
            <p>Welcome back! You’re signed in with Spotify.</p>
            <ul>
              <li><strong>Access Token:</strong> {`${accessToken}`}</li>
              <li><strong>Refresh Token:</strong> {`${refreshToken}`}</li>
              <li><strong>Expires In:</strong> {`${expiresIn}`} seconds</li>
            </ul>
            <button onClick={handleSignOut}>Sign Out</button>
          </div>
        ) : (
          <div className="login-section">
            <button
              className="spotify-button"
              onClick={() => window.location.href = "https://test-spotify-site.local:5050/login"}
            >
              Sign in with Spotify
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;