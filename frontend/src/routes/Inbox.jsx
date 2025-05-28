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
import axios from "axios";

const BACKEND_URL = "http://localhost:5050"

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

  const getChat = async () => {
    try {
      const res = await axios.post(`${BACKEND_URL}/get-or-create-chat`, {
        user1: currentUserId,
        user2: selectedUser,
      });
      setChatId(res.data.chatId);

      // fetch messages once
      const msgRes = await axios.get(`${BACKEND_URL}/messages/${res.data.chatId}`);
      setMessages(msgRes.data);
    } catch (err) {
      console.error("Failed to get chat", err);
    }
  };

  getChat();
}, [selectedUser]);


  const handleSend = async () => {
  if (!inputValue.trim() || !chatId) return;

  try {
    await axios.post(`${BACKEND_URL}/send-message`, {
      chatId,
      senderId: currentUserId,
      text: inputValue,
    });

    setMessages((prev) => [
      ...prev,
      { senderId: currentUserId, text: inputValue },
    ]);
    setInputValue("");
  } catch (err) {
    console.error("Send failed", err);
  }
};


  const handleAddUser = async () => {
    if (!newUserInput.trim()) return;

    const userId = newUserInput.trim();
    try {
        await axios.post(`${BACKEND_URL}/add-user`, { userId });

        setUsers((prev) => Array.from(new Set([...prev, userId])));
        setSelectedUser(userId);
        setModalIsOpen(false);
        setNewUserInput("");
    } catch (err) {
        console.error("Add user failed", err);
    }
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
