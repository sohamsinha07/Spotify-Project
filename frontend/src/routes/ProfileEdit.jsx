import React, { useEffect, useState } from 'react';
import ProfileForm from '../components/ProfileForm';
import { useParams } from 'react-router-dom';
import {FaUserCircle } from 'react-icons/fa';
import '../styles/ProfileEdit.css';
import axios from 'axios';

const ProfileEdit = () => {
  const { userId } = useParams();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      console.log("No userId provided");
      return;
    }

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
      await axios.put(`https://test-spotify-site.local:5050/api/user/${userId}`, updatedData);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="body-section">
      <h1 className="page-title">Edit Profile</h1>

      <div className="profile-edit-container">
        {/* Avatar */}
        <div className="avatar-section">
          <FaUserCircle className="avatar" />
          <div className="change-avatar">Change Avatar</div>
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