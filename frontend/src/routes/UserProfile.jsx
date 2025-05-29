import React, { useEffect, useState } from 'react';
import '../styles/UserProfile.css';
import { FaEnvelope, FaEdit, FaListUl, FaUserCircle, FaMusic } from 'react-icons/fa';
import UserProfileFilterModal from '../components/UserProfileFilterModal';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const UserProfile = () => {
  const { userId: urlUserId } = useParams();  // still support URL param if available
  const [userData, setUserData] = useState(null);
  const [resolvedTopArtists, setResolvedTopArtists] = useState([]);
  const [resolvedTopSongs, setResolvedTopSongs] = useState([]);
  const [resolvedLikedSongs, setResolvedLikedSongs] = useState([]);
  const [filters, setFilters] = useState({ liked: "All Time", artists: "All Time", songs: "All Time" });
  const [activeModal, setActiveModal] = useState(null);

  // Get logged-in user ID from localStorage
  const storedUserId = localStorage.getItem("currentUserId");
  const userId = urlUserId || storedUserId;

  useEffect(() => {
    if (!userId) {
      console.warn("No userId available");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(`https://test-spotify-site.local:5050/api/user/${userId}`);
        const data = res.data;
        setUserData(data);
        setResolvedTopArtists(Array.isArray(data.topArtists) ? data.topArtists : []);
        setResolvedTopSongs(Array.isArray(data.topSongs) ? data.topSongs : []);
        setResolvedLikedSongs(Array.isArray(data.likedSongs) ? data.likedSongs : []);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (userData === false) return <p>User not found.</p>;
  if (!userData) return <p>Loading...</p>;

  return (
    <>
      {activeModal && (
        <UserProfileFilterModal
          activeFilter={filters[activeModal]}  
          setActiveFilter={(newValue) => setFilters(prev => ({ ...prev, [activeModal]: newValue }))}
          onClose={() => setActiveModal(null)}  
        />
      )}

      <div className="user-profile-container">
        <aside className="profileSidebar">
          <Link to={`/profileEdit/${userId}`}>
            <FaEdit className="edit-icon" />
          </Link>

          <div className="avatar-container">
            {userData.profilePictureUrl ? (
              <img src={userData.profilePictureUrl} alt="Profile" className="avatar-img" />
            ) : (
              <FaUserCircle className="avatar" />
            )}
          </div>

          <h2 className="username">{userData.username}</h2>
          <hr className="divider" />
          <p className="bio">{userData.bio}</p>
          {/* <Link to="/inbox"><FaEnvelope className="email-icon" /></Link> */}
        </aside>

        <main className="main-content">
          {/* Liked Songs */}
          <div className="section">
            <div className="section-header">
              <h3>{userData.username}'s Liked Songs</h3>
              {/* <div className="filter-row">
                <p className="filter-label">Now Showing: {filters.liked}</p>
                <button className="icon-button" onClick={() => setActiveModal('liked')}><FaListUl /></button>
              </div> */}
            </div>
            {resolvedLikedSongs.length > 0 ? (
              resolvedLikedSongs.map((song) => (
                <div key={song.id} className="list-item">
                  <div className="list-avatar">
                    {song.imageUrl ? (
                      <img src={song.imageUrl} alt="Artist Avatar" className="avatar-img" />
                    ) : (
                      <FaMusic />
                    )}
                  </div>
                  <span>
                    {song.title} <span style={{ color: 'gray' }}>by: {song.artist}</span>
                  </span>
                </div>
              ))
            ) : (
              <p>No liked songs available.</p>
            )}
          </div>

          {/* Top Artists */}
          <div className="section">
            <div className="section-header">
              <h3>{userData.username}'s Top Artists</h3>
              {/* <div className="filter-row">
                <p className="filter-label">Now Showing: {filters.artists}</p>
                <button className="icon-button" onClick={() => setActiveModal('artists')}><FaListUl /></button>
              </div> */}
            </div>
            {resolvedTopArtists.length > 0 ? (
              resolvedTopArtists.map((artist) => (
                <div key={artist.id} className="list-item"> 
                <div className="list-avatar">
                  {artist.imageUrl ? (
                    <img src={artist.imageUrl} alt="Artist Avatar" className="avatar-img" />
                  ) : (
                    <FaMusic />
                  )}
                </div>
                  <span>{artist.name}</span>
                </div>
              ))
            ) : (
              <p>No top artists available.</p>
            )}
          </div>

          {/* Top Songs */}
          <div className="section">
            <div className="section-header">
              <h3>{userData.username}'s Top Songs</h3>
              {/* <div className="filter-row">
                <p className="filter-label">Now Showing: {filters.songs}</p>
                <button className="icon-button" onClick={() => setActiveModal('songs')}><FaListUl /></button>
              </div> */}
            </div>

            {resolvedTopSongs.length > 0 ? (
              resolvedTopSongs.map((song) => (
                <div key={song.id} className="list-item">
                <div className="list-avatar">
                  {song.imageUrl ? (
                    <img src={song.imageUrl} alt="Song Avatar" className="avatar-img" />
                  ) : (
                    <FaMusic />
                  )}
                </div>
                  <span>
                    {song.title} <span style={{ color: 'gray' }}> by: {song.artist}</span>
                  </span>
                </div>
              ))
            ) : (
              <p>No top songs available.</p>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default UserProfile;
