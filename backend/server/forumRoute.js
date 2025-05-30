const express = require("express");
const router = express.Router();
const db = require("../firebaseAdmin");

router.get('/all', async (req, res) => {
  try {
    console.log("Fetching users...");
    const usersSnapshot = await db.collection('users').get();
    console.log(`Fetched ${usersSnapshot.size} users`);
    const users = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      username: doc.data().username,
      profilePicture: doc.data().profilePictureUrl
    }));

    console.log("Fetching forums...");
    const forumsSnapshot = await db.collection('forums').get();
    console.log(`Fetched ${forumsSnapshot.size} forums`);
    const forums = forumsSnapshot.docs.map(doc => {
      const data = doc.data();
      console.log(`Forum data:`, data);  // Debug each forum
      return {
        id: doc.id,
        name: data.name || 'Untitled',  // Provide fallback
        description: data.description || 'No description',
        likes: data.likes || 0,
        creatorId: data.creatorId || null
      };
    });

    res.json({ users, forums });
  } catch (error) {
    console.error("🔥 Error fetching users and forums:", error);
    res.status(500).json({ error: `Failed to fetch data: ${error.message}` });
  }
});

module.exports = router;
