import React from 'react';
import {
  Container,
  Text,
  Divider,
  Grid,
  Avatar,
  Button,
  Flex,
  TextInput,
  Textarea,
  Box,
} from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import ProfileForm from './ProfileForm';

const ProfileEdit = () => {
  return (
    <Container size="md" py="md"> {/* smaller max width */}
      {/* Header */}
      <h1>Edit Profile</h1>
      
      <Divider mb="lg" />

      <div style={{ display: 'flex', gap: '16px'}}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <IconUser size={64} />
          <div style={{ marginTop: 8, fontWeight: 'bold', cursor: 'pointer', textAlign: 'center' }}>
            Change Avatar
          </div>
        </div>
        <div style={{ flex: 2, textAlign: 'center'}}>
          <ProfileForm />
        </div>
      </div>
    </Container>
  );
};

export default ProfileEdit;
