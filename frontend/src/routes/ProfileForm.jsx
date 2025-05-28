import React from 'react';
import '../styles/ProfileForm.css';

const ProfileForm = () => {
  return (
    <form className="form-container">
      {/* First and Last Name */}
      <div className="row">
        <div className="field">
          <label htmlFor="firstName" className="label">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
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
          placeholder="Enter username"
          className="input"
        />
      </div>

      {/* Description */}
      <div className="form-group">
        <label htmlFor="description" className="label">Description</label>
        <textarea
          id="description"
          name="description"
          placeholder="Tell us about yourself"
          rows="4"
          className="textarea"
        />
      </div>

      {/* Email */}
      <div className="form-group">
        <label htmlFor="email" className="label">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="you@example.com"
          className="input"
        />
      </div>

      {/* Country */}
      <div className="form-group">
        <label htmlFor="country" className="label">Country</label>
        <input
          type="text"
          id="country"
          name="country"
          placeholder="Enter country"
          className="input"
        />
      </div>
    </form>
  );
};

export default ProfileForm;
