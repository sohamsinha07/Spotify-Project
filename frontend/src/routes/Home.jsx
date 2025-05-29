import React, { useState, useEffect } from 'react';
import '../styles/Home.css';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';  // import useNavigate

const Home = () => {
  const [users, setUsers] = useState([]);
  const [forums, setForums] = useState([]);
  const navigate = useNavigate();  // initialize navigate

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const usersCollection = collection(db, 'users');
        const userSnapshot = await getDocs(usersCollection);
        const userList = userSnapshot.docs.map(doc => ({
          id: doc.id,
          username: doc.data().username,
          profilePicture: doc.data().profilePictureUrl
        }));

        // Fetch forums
        const forumsCollection = collection(db, 'forums');
        const forumSnapshot = await getDocs(forumsCollection);
        const forumList = forumSnapshot.docs.map(doc => {
          const data = doc.data();
          const user = userList.find(u => u.id === data.creatorId);
          return {
            id: doc.id,
            name: data.name,
            description: data.description,
            likes: data.likes,
            creator: user ? {
              id: user.id,
              username: user.username,
              profilePicture: user.profilePicture
            } : null
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

  return (
    <div className="home-container">
      <h1>Suggested Users</h1>
      <div className="horizontal-scroll">
        {users.map(user => (
          <div 
            key={user.id} 
            className="user-square"
            onClick={() => navigate(`/user/${user.id}`)}  // navigate to user profile on click
            style={{ cursor: 'pointer' }}  // add pointer cursor
            >
            <img 
              src={user.profilePicture || '/avatar.png'} 
              alt={user.username} 
              className="profile-picture" 
            />
            <p className="username-ellipsis">{user.username}</p>
          </div>
        ))}
      </div>

      <h1>Trending Discussions</h1>
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
