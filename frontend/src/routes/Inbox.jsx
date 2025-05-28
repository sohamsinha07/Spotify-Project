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
{/* import React, { useState } from "react";
import "../styles/Inbox.css";

const users = ["User 1", "User 2", "User 3", "User 4", "User 5", "User 6"];

export default function Inbox() {
  const [selectedUser, setSelectedUser] = useState("User 1");
  const [messages, setMessages] = useState([
    { sender: "me", text: "Hello World!" },
    { sender: "them", text: "Hello World!" },
    { sender: "them", text: "..." }
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim() === "") return;
    setMessages([...messages, { sender: "me", text: inputValue }]);
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="inbox-container">
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

          <div className="message-input-container">
            <input
              type="text"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="message-input"
            />
            <button className="send-button" onClick={handleSend}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
*/}

import React, { useState, useEffect } from "react";
import "../styles/Inbox.css";
import Modal from "react-modal";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  getDoc,
  query,
  where,
  onSnapshot,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase";

Modal.setAppElement("#root");

export default function Inbox() {
  const [users, setUsers] = useState([]); // List of usernames from Firestore
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newUserInput, setNewUserInput] = useState("");

  const currentUserId = "demoUser1"; // Simulate logged-in user

  // Load chats on user select
  useEffect(() => {
    if (!selectedUser) return;

    const getOrCreateChat = async () => {
      const usersRef = collection(db, "chats");
      const q = query(usersRef, where("participants", "in", [
        [currentUserId, selectedUser],
        [selectedUser, currentUserId],
      ]));
      const querySnapshot = await getDocs(q);

      let chatDoc;
      if (querySnapshot.empty) {
        chatDoc = await addDoc(collection(db, "chats"), {
          participants: [currentUserId, selectedUser],
          messages: [],
        });
      } else {
        chatDoc = querySnapshot.docs[0];
      }

      setChatId(chatDoc.id);

      // Live update messages
      const unsub = onSnapshot(doc(db, "chats", chatDoc.id), (docSnap) => {
        setMessages(docSnap.data().messages || []);
      });

      return () => unsub(); // Clean up
    };

    getOrCreateChat();
  }, [selectedUser]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const message = {
      senderId: currentUserId,
      text: inputValue,
      timestamp: Date.now(),
    };

    const chatRef = doc(db, "chats", chatId);
    await updateDoc(chatRef, {
      messages: arrayUnion(message),
    });

    setInputValue("");
  };

  const handleAddUser = async () => {
    if (!newUserInput.trim()) return;

    const existingUser = users.find((u) => u === newUserInput);
    if (!existingUser) {
      await setDoc(doc(db, "users", newUserInput), {
        username: newUserInput,
      });
      setUsers((prev) => [...prev, newUserInput]);
    }

    setSelectedUser(newUserInput);
    setModalIsOpen(false);
    setNewUserInput("");
  };

  useEffect(() => {
    const loadUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userList = querySnapshot.docs.map((doc) => doc.id).filter((id) => id !== currentUserId);
      setUsers(userList);
    };
    loadUsers();
  }, []);

  return (
    <div className="inbox-container">
      <div className="navbar-placeholder" />

      <div className="inbox-content">
        <div className="sidebar">
          <h2>Inbox</h2>
          <button onClick={() => setModalIsOpen(true)} className="add-user-btn">+ New Chat</button>
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
          <h2 className="chat-header">{selectedUser || "No Chat Selected"}</h2>
          <div className="messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`message ${msg.senderId === currentUserId ? "sent" : "received"}`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {selectedUser && (
            <div className="message-input-container">
              <input
                type="text"
                className="message-input"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button className="send-button" onClick={handleSend}>Send</button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Add New User"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Add User to Chat</h2>
        <input
          type="text"
          placeholder="Enter username or user ID"
          value={newUserInput}
          onChange={(e) => setNewUserInput(e.target.value)}
        />
        <button onClick={handleAddUser}>Start Chat</button>
      </Modal>
    </div>
  );
}
