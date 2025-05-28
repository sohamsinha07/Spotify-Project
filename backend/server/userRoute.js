const express = require("express");
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

const router = express.Router();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

const fetchDocsByIds = async (collectionName, ids) => {
  if (!ids || ids.length === 0) return [];
  const refs = ids.map(id => db.collection(collectionName).doc(id));
  const snaps = await db.getAll(...refs);
  return snaps.map(snap => ({ id: snap.id, ...snap.data() }));
};

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) return res.status(404).json({ error: "User not found" });

    const user = userDoc.data();

    const [likedSongs, topSongs, topArtists] = await Promise.all([
      fetchDocsByIds("songs", user.likedSongs),
      fetchDocsByIds("songs", user.topSongs),
      fetchDocsByIds("artists", user.topArtists),
    ]);

    res.json({
      ...user,
      likedSongs,
      topSongs,
      topArtists,
    });
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
