import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './routes/Home'
import Forum from './routes/Forum'
import Inbox from './routes/Inbox'
import UserProfile from './routes/UserProfile'
import Settings from './routes/Settings'


function App() {


  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/forum" element={<Forum />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/userProfile" element={<UserProfile />} />
        <Route path="/settings" element={<Settings />} />

      </Routes>
    </>
  )
}

export default App