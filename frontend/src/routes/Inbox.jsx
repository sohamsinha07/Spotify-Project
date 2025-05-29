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
import { FaTrashAlt } from "react-icons/fa";


const BACKEND_URL = "https://test-spotify-site.local:5050/inbox";

Modal.setAppElement("#root");

export default function Inbox() {
  const [users, setUsers] = useState([]); // List of usernames from Firestore
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newUserInput, setNewUserInput] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);


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
    // 1. Add user in backend
    await axios.post(`${BACKEND_URL}/add-user`, { userId });

    // 2. Refetch updated users list
    const updatedUsers = await axios.get(`${BACKEND_URL}/users`);
    const filtered = updatedUsers.data.filter((u) => u !== currentUserId);
    setUsers(filtered);

    // 3. Select the new user and store in localStorage
    setSelectedUser(userId);
    localStorage.setItem("selectedUser", userId);

    // 4. Cleanup
    setNewUserInput("");
    setModalIsOpen(false);
  } catch (err) {
    console.error("Add user failed", err);
  }
};


useEffect(() => {
  const loadUsers = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/users`);
      const filtered = response.data.filter((u) => u !== currentUserId);
      setUsers(filtered);

      // Restore previous chat if available
      const saved = localStorage.getItem("selectedUser");
      if (saved && filtered.includes(saved)) {
        setSelectedUser(saved);
      }
    } catch (error) {
      console.error("Failed to load users", error);
    }
  };

  loadUsers();
}, []);

const handleDeleteChat = (userId) => {
  setUserToDelete(userId);
  setShowDeleteModal(true);
};

const confirmDeleteChat = async () => {
  if (!userToDelete) return;

  try {
    await axios.delete(`${BACKEND_URL}/delete-chat`, {
      data: {
        user1: currentUserId,
        user2: userToDelete,
      },
    });

    const response = await axios.get(`${BACKEND_URL}/users`);
    const filtered = response.data.filter((u) => u !== currentUserId);
    setUsers(filtered);

    // Clear chat if it's the one being viewed
    if (selectedUser === userToDelete) {
      setSelectedUser(null);
      setMessages([]);
      localStorage.removeItem("selectedUser");
    }

    setShowDeleteModal(false);
    setUserToDelete(null);
  } catch (err) {
    console.error("Failed to delete chat", err);
  }
};



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
