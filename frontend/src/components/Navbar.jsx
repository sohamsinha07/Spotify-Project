import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/NavBar.css'; 
import logo from '../assets/icon.png';
import { FaClipboardList, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';

const Navbar = () => {
  const [profilePic, setProfilePic] = useState('/avatar.png');
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('currentUserId');
    if (storedUserId) {
      setCurrentUserId(storedUserId);
      axios.get(`https://test-spotify-site.local:5050/api/user/${storedUserId}`)
        .then(response => {
          const data = response.data;
          setProfilePic(data.profilePictureUrl || '/avatar.png');
          localStorage.setItem('currentUserProfilePicture', data.profilePictureUrl || '/avatar.png');
        })
        .catch(error => {
          console.error("Failed to fetch user profile:", error);
        });
    }
  }, []);


  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/home" className="navbar-home-link">
          <img src={logo} alt="logo" className="logo" />
          <span className="brand">SpotiVibe</span>
        </Link>
      </div>
      <div className="navbar-right">
        <Link to="/forum"><FaClipboardList /></Link>
        <Link to="/inbox"><FaEnvelope /></Link>
        <Link to={currentUserId ? `/user/${currentUserId}` : "/user"}>
          <img src={profilePic} alt="Profile" className="navbar-profile-pic" />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
