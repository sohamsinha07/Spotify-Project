import React, { useState, useEffect } from 'react';
import '../styles/Home.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../firebase';  // Ensure correct path
import LikeButton from '../components/Likes';  // If missing
import Posts from '../components/Posts';  // If missing

const Home = () => {
  const [users, setUsers] = useState([]);
  const [forums, setForums] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const currentUserId = localStorage.getItem("currentUserId");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const userIdFromUrl = urlParams.get("userId");

    if (userIdFromUrl && !currentUserId) {
      fetch(`https://test-spotify-site.local:5050/api/user/${userIdFromUrl}`)
        .then(res => res.json())
        .then(data => {
          localStorage.setItem("currentUserId", userIdFromUrl);
          localStorage.setItem("currentUserProfilePicture", data.profilePictureUrl || '/avatar.png');
          window.location.href = '/home';  // Clean URL
        })
        .catch(err => {
          console.error("Failed to fetch user data:", err);
        });
    }
  }, [location, currentUserId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const userSnapshot = await getDocs(usersCollection);
        const userList = userSnapshot.docs.map(doc => ({
          id: doc.id,
          username: doc.data().username,
          profilePicture: doc.data().profilePictureUrl,
          isPrivate: doc.data().isPrivate
        }));

        const forumsCollection = collection(db, 'forums');
        const forumSnapshot = await getDocs(forumsCollection);
        const forumList = forumSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            description: data.description,
            likes: data.likes,
            commentCount: data.commentCount,
            createdAt: data.createdAt,
            creatorId: data.creatorId
          };
        });

        setUsers(userList);
        setForums(forumList);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const filteredUsers = users.filter(user => user.id !== currentUserId);

  // Build usersMap from users
  const usersMap = users.reduce((map, user) => {
    map[user.id] = user;
    return map;
  }, {});

  // Sort forums by likes
  const topLikedForums = [...forums].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 5);

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown date";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  // Handle forum click
  const handleForumClick = (id) => {
    navigate(`/forum/${id}`);
  };

  return (
    <div className="home-container">
      <h1>Suggested Users</h1>
      <div className="horizontal-scroll">
        {filteredUsers.length > 0 ? (
          filteredUsers.map(user => (
            <div
              key={user.id}
              className="user-square"
              onClick={() => navigate(`/user/${user.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={user.profilePicture || '/avatar.png'}
                alt={user.username}
                className="profile-picture"
              />
              <p className="username-ellipsis">{user.username}</p>
            </div>
          ))
        ) : (
          <p>Loading users...</p>
        )}
      </div>

      <h1>Trending Discussions</h1>
      {forums.length > 0 ? (
        <div className="home-forum-section">
          <div className="forum-home-container">
            {topLikedForums.map(({ id, name, description, creatorId, likes = 0, commentCount = 0, createdAt }) => {
              const creator = usersMap[creatorId];
              return (
                <div
                  key={id}
                  className="forum-card"
                  onClick={() => handleForumClick(id)}
                >
                  <div className="forum-header">
                    <h3 className="forum-name">{name}</h3>
                  </div>
                  <p className="forum-description">{description}</p>
                  <div className="forum-badges">
                    <LikeButton forumId={id} initialLikes={likes} />
                    <Posts forumId={id} initialCount={commentCount} />
                  </div>
                  <div className="forum-meta">
                    <span className="forum-creator">
                      Created by <strong>{creator?.username || "Unknown"}</strong>
                    </span>
                    <span className="forum-date">{formatDate(createdAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p>Loading forum posts...</p>
      )}
    </div>
  );
};

export default Home;
