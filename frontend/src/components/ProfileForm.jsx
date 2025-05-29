import React, { useState, useEffect } from 'react';
import '../styles/ProfileForm.css';

const ProfileForm = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    isPrivate: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        username: initialData.username || '',
        bio: initialData.bio || '',
        isPrivate: initialData.isPrivate || false,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: fieldValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      {/* Username */}
      <div className="form-group">
        <label htmlFor="username" className="label">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Enter username"
          className="input"
        />
      </div>

      {/* Bio */}
      <div className="form-group">
        <label htmlFor="bio" className="label">Bio</label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell us about yourself"
          rows="4"
          className="textarea"
        />
      </div>

      {/* isPrivate Toggle */}
      <div className="form-group">
        <label htmlFor="isPrivate" className="label">
          <input
            type="checkbox"
            id="isPrivate"
            name="isPrivate"
            checked={formData.isPrivate}
            onChange={handleChange}
          />
          &nbsp;Make my profile private
        </label>
      </div>

      <div className="button-container">
        <button type="submit" className="button">Save Changes</button>
      </div>
    </form>
  );
};

export default ProfileForm;
