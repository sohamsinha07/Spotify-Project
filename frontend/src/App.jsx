import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './routes/Home'
import Forum from './routes/Forum'
import Inbox from './routes/Inbox'
import UserProfile from './routes/UserProfile'
import ProfileEdit from './routes/ProfileEdit'
import Login from './routes/Login'
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
        <Route path="/user" element={<UserProfile />} />
        <Route path="/profileEdit" element={<ProfileEdit />} />
        <Route path="/login" element={<Login />} />

        <Route path="/user/:userId" element={<UserProfile />} />
      </Routes>
    </>
  )
}

export default App