import React, { useState, useEffect } from 'react';
import '../styles/Home.css';
import { db } from '../firebase';  // Adjust the path if needed
import { collection, getDocs } from 'firebase/firestore';

const Home = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const userSnapshot = await getDocs(usersCollection);
        const userList = userSnapshot.docs.map(doc => ({
          id: doc.id,
          username: doc.data().username,
          profilePicture: doc.data().profilePictureUrl
        }));
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="home-container">
      <h1>Suggested Users</h1>
      <div className="horizontal-scroll">
        {users.map(user => (
          <div key={user.id} className="user-square">
            <img src={user.profilePicture} alt={user.username} className="profile-picture" />
            <p>{user.username}</p>
          </div>
        ))}
      </div>

      <h1>Top Discussions</h1>
      {Array.from({ length: 20 }).map((_, index) => (
        <div key={index} className="vertical-rectangle"></div>
      ))}
    </div>
  );
};

export default Home;
