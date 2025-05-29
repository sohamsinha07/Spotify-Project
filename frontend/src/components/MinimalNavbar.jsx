import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/NavBar.css'; 
import logo from '../assets/icon.png';

const Navbar = () => {
    return (
      <nav className="navbar">
        <div className="navbar-left">
            <img src={logo} alt="logo" className="logo" />
            <span className="brand">SpotiVibe</span>
        </div>
      </nav>
    )
}

export default Navbar