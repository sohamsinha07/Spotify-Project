import React, { useEffect, useState } from 'react';
import ProfileForm from '../components/ProfileForm';
import { useParams } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import '../styles/ProfileEdit.css';
import axios from 'axios';

const ProfileEdit = () => {
  const { userId } = useParams();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const [newAvatarUrl, setNewAvatarUrl] = useState('');

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(`https://test-spotify-site.local:5050/api/user/${userId}`);
        setFormData(res.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleSubmit = async (updatedData) => {
    try {
      const payload = { ...updatedData };
      if (formData.profilePictureUrl) {
        payload.profilePictureUrl = formData.profilePictureUrl;
      }

      await axios.put(`https://test-spotify-site.local:5050/api/user/${userId}`, payload);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile');
    }
  };

  const handleAvatarSave = () => {
    if (!newAvatarUrl) return;
    setFormData((prev) => ({ ...prev, profilePictureUrl: newAvatarUrl }));
    setShowAvatarDialog(false);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="body-section">
      <h1 className="page-title">Edit Profile</h1>

      <div className="profile-edit-container">
        {/* Avatar */}
        <div className="avatar-section">
          {formData.profilePictureUrl ? (
            <img
              src={formData.profilePictureUrl}
              alt="Profile"
              className="avatar-img"
            />
          ) : (
            <FaUserCircle className="avatar" />
          )}
          <button
            className="change-avatar-button"
            onClick={() => setShowAvatarDialog(true)}
          >
            Change Avatar
          </button>

          {/* Avatar URL Input Dialog */}
          {showAvatarDialog && (
            <div className="avatar-dialog">
              <input
                type="text"
                placeholder="Enter image URL"
                value={newAvatarUrl}
                onChange={(e) => setNewAvatarUrl(e.target.value)}
              />
              <div className="button-group">
                <button onClick={handleAvatarSave}>Apply</button>
                <button onClick={() => setShowAvatarDialog(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>

        {/* Form */}
        <div className="form-section">
          <ProfileForm initialData={formData} onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
