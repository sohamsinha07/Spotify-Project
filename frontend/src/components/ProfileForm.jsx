import React, {useState, useEffect} from 'react';
import '../styles/ProfileForm.css';

const ProfileForm = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    bio: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        username: initialData.username || '',
        email: initialData.email || '',
        bio: initialData.bio || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
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
      {/* First and Last Name */}
      <div className="row">
        <div className="field">
          <label htmlFor="firstName" className="label">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter your first name"
            className="input"
          />
        </div>

        <div className="field">
          <label htmlFor="lastName" className="label">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter your last name"
            className="input"
          />
        </div>
      </div>

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

      {/* Email */}
      <div className="form-group">
        <label htmlFor="email" className="label">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          className="input"
        />
      </div>

      {/* Bio */}
      <div className="form-group">
        <label htmlFor="bio" className="label">Bio</label>
        <textarea
          id="Bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell us about yourself"
          rows="4"
          className="textarea"
        />
      </div>

      {/* Submit Button */}
      <div className="button-container">
        <button type="submit" className="button">Save Changes</button>
      </div>

    </form>
  );
};

export default ProfileForm;
