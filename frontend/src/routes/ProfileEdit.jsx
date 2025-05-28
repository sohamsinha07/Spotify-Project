import { React, useEffect, useState } from 'react';
import ProfileForm from './ProfileForm';
import {FaUserCircle } from 'react-icons/fa';
import '../styles/ProfileEdit.css';

const ProfileEdit = () => {
  return (
    <div className="body-section">
      <h1 className="page-title">Edit Profile</h1>

      <div className="profile-edit-container">
        {/* Left: Avatar */}
        <div className="avatar-section">
          <FaUserCircle className="avatar" />
          <div className="change-avatar">Change Avatar</div>
        </div>

        {/* Right: Form */}
        <div className="form-section">
          <ProfileForm />
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
