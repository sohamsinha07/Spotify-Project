const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const db = admin.firestore();

// GET /api/user/:userId — fetch user by Firestore doc ID
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(userDoc.data());
  } catch (err) {
    console.error("Error fetching user:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/user/:userId — update user profile by Firestore doc ID
// PUT /api/user/:userId — update only username, bio, isPrivate
router.put("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const { username, bio, isPrivate, profilePictureUrl } = req.body;

  try {
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const updates = {};
    if (username !== undefined) updates.username = username;
    if (bio !== undefined) updates.bio = bio;
    if (isPrivate !== undefined) updates.isPrivate = isPrivate;
    if (profilePictureUrl !== undefined) updates.profilePictureUrl = profilePictureUrl;

    await userRef.update(updates);

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Error updating user:", err);
    return res.status(500).json({ error: "Failed to update user" });
  }
});


module.exports = router;
