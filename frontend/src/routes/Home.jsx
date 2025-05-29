import React, { useState, useEffect } from 'react';
import '../styles/Home.css';
import { useNavigate, useLocation } from 'react-router-dom';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [forums, setForums] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const currentUserId = localStorage.getItem("currentUserId");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const userIdFromUrl = urlParams.get("userId");

    // If userId is present in the URL but not in localStorage, fetch user data and set it
    if (userIdFromUrl && !currentUserId) {
      fetch(`https://test-spotify-site.local:5050/api/user/${userIdFromUrl}`)
        .then(res => res.json())
        .then(data => {
          localStorage.setItem("currentUserId", userIdFromUrl);
          localStorage.setItem("currentUserProfilePicture", data.profilePictureUrl || '/avatar.png');
          window.location.href = '/home';  // Optional: Clean the URL
        })
        .catch(err => {
          console.error("Failed to fetch user data:", err);
        });
    }
  }, [location, currentUserId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://test-spotify-site.local:5050/api/forum/all', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();

        if (response.ok) {
          const userList = data.users;
          const forumList = data.forums.map(forum => {
            const creator = userList.find(u => u.id === forum.creatorId);
            return {
              ...forum,
              creator: creator ? {
                id: creator.id,
                username: creator.username,
                profilePicture: creator.profilePicture
              } : null
            };
          });
          setUsers(userList);
          setForums(forumList);
        } else {
          console.error("Failed to fetch data from server:", data.error);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const filteredUsers = users.filter(user => user.id !== currentUserId);

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

      <h1>Top Discussions</h1>
      {forums.length > 0 ? (
        forums.map(forum => (
          <div key={forum.id} className="forum-rectangle">
            <div className="forum-content">
              {forum.creator && (
                <img
                  src={forum.creator.profilePicture || '/avatar.png'}
                  alt={forum.creator.username}
                  className="creator-pic"
                  onClick={() => navigate(`/user/${forum.creator.id}`)}
                  style={{ cursor: 'pointer' }}
                />
              )}
              <div className="forum-text">
                {forum.creator && <h3 className="forum-username">{forum.creator.username}</h3>}
                <h2>{forum.name}</h2>
                <p>{forum.description}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>Loading forum posts...</p>
      )}
    </div>
  );
};

export default Home;
