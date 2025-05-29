// backend/server/userRoute.js
const express = require("express");
const router = express.Router();
const { db } = require("../firebaseAdmin");

// Endpoint to get users and forums
router.get('/all', async (req, res) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const users = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      username: doc.data().username,
      profilePicture: doc.data().profilePictureUrl
    }));

    const forumsSnapshot = await db.collection('forums').get();
    const forums = forumsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        description: data.description,
        likes: data.likes,
        creatorId: data.creatorId
      };
    });

    res.json({ users, forums });
  } catch (error) {
    console.error("Error fetching users and forums:", error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

module.exports = router;