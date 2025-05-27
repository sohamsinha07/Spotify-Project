import React from 'react';

const ProfileForm = () => {
  return (
    <form style={{ maxWidth: '600px', margin: '0 auto', padding: '24px' }}>
      {/* First and Last Name in a row */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        <div style={{ flex: 1 }}>
          <label htmlFor="firstName" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="Enter your first name"
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <label htmlFor="lastName" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Enter your last name"
            style={{
              width: '100%',
              padding: '8px 12px',
              fontSize: '16px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* Username */}
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="username" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Enter username"
          style={{
            width: '100%',
            padding: '8px 12px',
            fontSize: '16px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Description */}
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="description" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Description
        </label>
        <textarea
          id="description"
          name="description"
          placeholder="Tell us about yourself"
          rows="4"
          style={{
            width: '100%',
            padding: '8px 12px',
            fontSize: '16px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            boxSizing: 'border-box',
            resize: 'vertical',
          }}
        />
      </div>

      {/* Email */}
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="email" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="you@example.com"
          style={{
            width: '100%',
            padding: '8px 12px',
            fontSize: '16px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Country */}
      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="country" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Country
        </label>
        <input
          type="text"
          id="country"
          name="country"
          placeholder="Enter country"
          style={{
            width: '100%',
            padding: '8px 12px',
            fontSize: '16px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            boxSizing: 'border-box',
          }}
        />
      </div>
    </form>
  );
};

export default ProfileForm;
