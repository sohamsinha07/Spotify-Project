const express = require('express');
const admin = require('firebase-admin');

const router = express.Router();
const db = admin.firestore();

// Update user profile
router.put('/:userId', async (req, res) => {
  const { userId } = req.params;
  const updatedData = req.body;

  if (!userId) {
    return res.status(400).send('User ID is required');
  }

  try {
    const userRef = db.collection('users').doc(userId);
    const docSnap = await userRef.get();

    if (!docSnap.exists) {
      return res.status(404).send('User not found');
    }

    await userRef.update(updatedData);

    res.status(200).send('User profile updated successfully');
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).send('Failed to update user profile');
  }
});

module.exports = router;
