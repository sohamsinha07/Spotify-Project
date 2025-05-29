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
  const [userMap, setUserMap] = useState({});


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
      const response = await axios.get(`${BACKEND_URL}/users-full`); // new endpoint returning full user objects
      const allUsers = response.data;
  
      // Create ID → username map
      const map = {};
      allUsers.forEach(user => {
        map[user.id] = user.username;
      });
  
      setUserMap(map);
  
      const filtered = allUsers
        .filter((u) => u.id !== currentUserId)
        .map(u => u.id); // list of userIds only
      setUsers(filtered);
  
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

    // Remove user from sidebar list
    setUsers((prev) => prev.filter((u) => u !== userToDelete));

    // Clear chat view if deleted user is selected
    if (selectedUser === userToDelete) {
      setSelectedUser(null);
      setMessages([]);
      localStorage.removeItem("selectedUser");
    }

    // Cleanup
    setUserToDelete(null);
    setShowDeleteModal(false);
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
              <span style={{ flex: 1 }}>{userMap[user] || user}</span>
              <FaTrashAlt
                className="delete-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteChat(user);
                }}
              />
            </div>
          ))}
          </div>
        </div>

        <div className="chat-box">
        <h2 className="chat-header">
          {selectedUser ? `Chat with ${userMap[selectedUser] || selectedUser}` : "No Chat Selected"}
        </h2>
          <div className="messages">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`message ${msg.senderId === currentUserId ? "sent" : "received"}`}
            >
                <strong className={msg.senderId === currentUserId ? "me" : "other"}>
                  {`${userMap[msg.senderId] || msg.senderId}:`}
                </strong>
              <div>{msg.text}</div>
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
          <div className="modal-header">
            <h2>Add User to Chat</h2>
            <button className="modal-close" onClick={() => setModalIsOpen(false)}>×</button>
          </div>

          <input
            type="text"
            placeholder="Enter username or user ID"
            value={newUserInput}
            onChange={(e) => setNewUserInput(e.target.value)}
          />

          <button className="modal-submit" onClick={handleAddUser}>Start Chat</button>
        </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onRequestClose={() => {
          setShowDeleteModal(false);
          setUserToDelete(null);
        }}
        contentLabel="Confirm Delete Chat"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Confirm Chat Deletion</h2>
        <p>
          Are you sure you want to delete the chat with <strong>{userToDelete}</strong>? <br />
          <span style={{ color: "red" }}>This action cannot be undone and all messages will be permanently deleted.</span>
        </p>
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
          <button onClick={confirmDeleteChat} style={{ backgroundColor: "#e53935", color: "#fff", padding: "8px 16px" }}>
            Yes, Delete
          </button>
          <button onClick={() => setShowDeleteModal(false)} style={{ padding: "8px 16px" }}>
            Cancel
          </button>
        </div>
      </Modal>

    </div>
  );
}
