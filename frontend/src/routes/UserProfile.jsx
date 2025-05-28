import React, { useEffect, useState } from 'react';
import '../styles/UserProfile.css';
import { FaEnvelope, FaEdit, FaListUl, FaUserCircle } from 'react-icons/fa';
import UserProfileFilterModal from '../components/UserProfileFilterModal';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

import { db } from "../firebase";
import { getDocs, collection, query, where } from "firebase/firestore";

const fetchDocumentsByIds = async (collectionName, ids) => {
  if (!ids || ids.length === 0) return [];
  const q = query(collection(db, collectionName), where("__name__", "in", ids));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const { userId } = useParams();
  
  const [filters, setFilters] = useState({
    liked: "All",
    artists: "All",
    songs: "All"
  });

  const [resolvedTopArtists, setResolvedTopArtists] = useState([]);
  const [resolvedTopSongs, setResolvedTopSongs] = useState([]);
  const [resolvedLikedSongs, setResolvedLikedSongs] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5050/api/user/${userId}`);
        const data = res.data;
        setUserData(data);
  
        const [liked, artists, songs] = await Promise.all([
          fetchDocumentsByIds("songs", data.likedSongs),
          fetchDocumentsByIds("artists", data.topArtists),
          fetchDocumentsByIds("songs", data.topSongs),
        ]);
  
        setResolvedLikedSongs(liked);
        setResolvedTopArtists(artists);
        setResolvedTopSongs(songs);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setUserData(false);
      }
    };
  
    fetchUser();
  }, [userId]);

  if (userData === false) return <p>User not found.</p>;
  if (!userData) return <p>Loading...</p>;

  console.log("Resolved liked songs:", resolvedLikedSongs);

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
        <aside className="profileSidebar">
          <Link to="/profileEdit">
            <FaEdit className="edit-icon" />
          </Link>
          <img src={userData.profileImage} alt="Profile" className="avatar-img" />
          <h2 className="username">{userData.displayName}</h2>
          <hr className="divider" />
          <p className="bio">{userData.bio}</p>
          <Link to="/inbox">
            <FaEnvelope className="email-icon" />
          </Link>
        </aside>

        <main className="main-content">
          <div className="section">
            <div className="section-header">
              <h3>{userData.displayName}’s Liked Songs</h3>
              <div className="filter-row">
                <p className="filter-label">Now Showing: {filters.liked}</p>
                <button className="icon-button" onClick={() => setActiveModal('liked')}>
                  <FaListUl />
                </button>
              </div>
            </div>
            {resolvedLikedSongs.map((song) => (
              <div key={`liked-${song.id}`} className="list-item">
                <div className="list-avatar">{song.name?.charAt(0)}</div>
                <span>{song.name}</span>
              </div>
            ))}
          </div>

          <div className="section">
            <div className="section-header">
              <h3>{userData.displayName}’s Top Artists</h3>
              <div className="filter-row">
                <p className="filter-label">Now Showing: {filters.artists}</p>
                <button className="icon-button" onClick={() => setActiveModal('artists')}>
                  <FaListUl />
                </button>
              </div>
            </div>
            {resolvedTopArtists.map((artist) => (
              <div key={artist.id} className="list-item">
                <div className="list-avatar">{artist.name?.charAt(0)}</div>
                <span>{artist.name}</span>
              </div>
            ))}
          </div>

          <div className="section">
            <div className="section-header">
              <h3>{userData.displayName}’s Top Songs</h3>
              <div className="filter-row">
                <p className="filter-label">Now Showing: {filters.songs}</p>
                <button className="icon-button" onClick={() => setActiveModal('songs')}>
                  <FaListUl />
                </button>
              </div>
            </div>
            {resolvedTopSongs.map((song) => (
              <div key={song.id} className="list-item">
                <div className="list-avatar">{song.name?.charAt(0)}</div>
                <span>{song.name}</span>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
};

export default UserProfile;
