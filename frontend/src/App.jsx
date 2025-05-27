import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './routes/Home'
import Forum from './routes/Forum'
import Inbox from './routes/Inbox'
import UserProfile from './routes/UserProfile'
import Settings from './routes/Settings'
import { useState, useEffect } from "react";


function App() {

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
    }

    // Optionally, remove the parameters from the URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }, []);

  function handleSignOut() {
    setAccessToken(null);
    setRefreshToken(null);
    setExpiresIn(null);
  }
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/userProfile" element={<UserProfile />} />
        <Route path="/profileEdit" element={<ProfileEdit />} />
        <Route path="/settings" element={<Settings />} />

      </Routes>

            <p>Spotify Login Demo</p>
      {accessToken ? (
        <div>
          <p>You are signed in</p>
          <ul>
            <li>Authentication Token: {`${accessToken}`}</li>
            <li>Refresh Token: {`${refreshToken}`}</li>
            <li>Seconds to Expiration: {`${expiresIn}`}</li>
          </ul>
          <div
            onClick={handleSignOut}
            style={{
              color: "white",
              background: "black",
              width: "80px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "12px",
              padding: "4px 6px",
            }}
          >
            Sign Out
          </div>
        </div>
      ) : (
        <a href="https://test-spotify-site.local:5050/login">
          Login with Spotify
        </a>
      )}
    </>
  )
}

export default App