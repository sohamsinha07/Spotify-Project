{/*
import React from 'react'
import'../styles/Inbox.css';

const Inbox = () => {
    return (
        <div>
            <h1>hi im inbox</h1>
        </div>
    )
}

export default Inbox
*/}
import React, { useState } from "react";
import "../styles/Inbox.css";

const users = ["User 1", "User 2", "User 3", "User 4", "User 5", "User 6"];

const messages = [
  { sender: "me", text: "Hello World!" },
  { sender: "them", text: "Hello World!" },
  { sender: "them", text: "..." }
];

export default function Inbox() {
  const [selectedUser, setSelectedUser] = useState("User 4");

  return (
    <div className="inbox-container">
      {/* Leave space for the Navbar */}
      <div className="navbar-placeholder" />

      <div className="inbox-content">
        <div className="sidebar">
          <h2>Inbox</h2>
          <p className="subtitle">Chat with Other Spotivibe Users!</p>
          <div className="user-list">
            {users.map((user) => (
              <div
                key={user}
                className={`user-item ${user === selectedUser ? "active" : ""}`}
                onClick={() => setSelectedUser(user)}
              >
                {user}
              </div>
            ))}
          </div>
        </div>

        <div className="chat-box">
          <h2 className="chat-header">{selectedUser}</h2>
          <div className="messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.sender === "me" ? "sent" : "received"}`}
              >
                {msg.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
