import React from 'react';
import '../styles/UserProfile.css';
import { FaEnvelope, FaEdit, FaListUl, FaUserCircle } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import UserProfileFilterModal from '../components/UserProfileFilterModal';

const user = {
  username: 'Raver123',
  bio: 'I like listening to edm!',
  likedSongs: ['Stay - Zedd', 'Levitating - Dua Lipa'],
  topArtists: ['Illenium', 'Kygo'],
  topSongs: ['Silence - Marshmello', 'Waiting For Love - Avicii']
};

const UserProfile = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [filters, setFilters] = useState({
    liked: 'All Time',
    artists: 'All Time',
    songs: 'All Time',
  });

  return (
    <>
      {/* Modal and trigger */}
      {activeModal && (
        <UserProfileFilterModal
          activeFilter={filters[activeModal]}
          setActiveFilter={(newValue) => {
            setFilters((prev) => ({ ...prev, [activeModal]: newValue }));
          }}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* Main profile layout */}
      <div className="user-profile-container">
        <aside className="sidebar">
          <FaEdit className="edit-icon" />
          <FaUserCircle className="avatar" />
          <h2 className="username">{user.username}</h2>
          <hr className="divider" />
          <p className="bio">{user.bio}</p>
          <FaEnvelope className="email-icon" />
        </aside>

        <main className="main-content">
          <div className="section">
            <div className="section-header">
              <h3>{user.username}’s Liked Songs</h3>
              <div className="filter-row">
                <p className="filter-label">Now Showing: {filters.liked}</p>
                <button className="icon-button" onClick={() => setActiveModal('liked')}>
                  <FaListUl />
                </button>
              </div>
            </div>
            {user.likedSongs.map((song, index) => (
              <div key={index} className="list-item">
                <div className="list-avatar">{song.charAt(0)}</div>
                <span>{song}</span>
              </div>
            ))}
          </div>

          <div className="section">
            <div className="section-header">
              <h3>{user.username}’s Top Artists</h3>
              <div className="filter-row">
                <p className="filter-label">Now Showing: {filters.artists}</p>
                <button className="icon-button" onClick={() => setActiveModal('artists')}>
                  <FaListUl />
                </button>
              </div>
            </div>
            {user.topArtists.map((artist, index) => (
              <div key={index} className="list-item">
                <div className="list-avatar">{artist.charAt(0)}</div>
                <span>{artist}</span>
              </div>
            ))}
          </div>

          <div className="section">
            <div className="section-header">
              <h3>{user.username}’s Top Songs</h3>
              <div className="filter-row">
                <p className="filter-label">Now Showing: {filters.songs}</p>
                <button className="icon-button" onClick={() => setActiveModal('songs')}>
                  <FaListUl />
                </button>
              </div>
            </div>
            {user.topSongs.map((song, index) => (
              <div key={index} className="list-item">
                <div className="list-avatar">{song.charAt(0)}</div>
                <span>{song}</span>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default UserProfile;
