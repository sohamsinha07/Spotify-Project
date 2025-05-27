import React from 'react';
import ProfileForm from './ProfileForm';
import Avatar from '../../public/avatar.png'

const ProfileEdit = () => {
  return (
    <>
  <h1
    style={{
      padding: '16px 0',
      fontSize: '3rem',
      marginBottom: '24px',
      marginLeft: '48px'
    }}
  >
    Edit Profile
  </h1>

  <div style={{ display: 'flex', gap: '16px', alignItems: 'stretch'}}>
    {/* Left: Avatar */}
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <img src={Avatar} alt="User Avatar" style={{ width: 200, height: 200, borderRadius: '50%' }} />
      <div
        style={{
          marginTop: 8,
          fontWeight: 'bold',
          cursor: 'pointer',
          textAlign: 'center',
        }}
      >
        Change Avatar
      </div>
    </div>

    {/* Right: Form */}
    <div style={{ flex: 2 }}>
      <ProfileForm />
    </div>
  </div>
</>

  );
};

export default ProfileEdit;
