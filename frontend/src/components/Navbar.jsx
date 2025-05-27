import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/NavBar.css'; 
import logo from '../assets/icon.png';
import { FaClipboardList, FaEnvelope, FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
    return (
      <nav className="navbar">
        <div className="navbar-left">
            <img src={logo} alt="logo" className="logo" />
            <span className="brand">SpotiVibe</span>
        </div>
        <div className="navbar-right">
            <Link to="/forum"><FaClipboardList /></Link>
            <Link to="/inbox"><FaEnvelope /></Link>
            <Link to="/userProfile"><FaUserCircle /></Link>
        </div>
      </nav>
    )
}

export default Navbar