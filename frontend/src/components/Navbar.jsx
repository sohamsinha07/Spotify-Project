import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/forum">Forum</Link></li>
                <li><Link to="/inbox">Inbox</Link></li>
                <li><Link to="/userProfile">UserProfile</Link></li>
                <li><Link to="/settings">Settings</Link></li>
            </ul>
        </nav>
    )
}

export default Navbar