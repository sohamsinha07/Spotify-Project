const express = require("express");
const { db } = require("../firebaseAdmin");  

const router = express.Router();

const fetchSongDataByIds = async (ids) => {
  if (!ids || ids.length === 0) return [];

  const songRefs = ids.map(id => db.collection('songs').doc(id));
  const songSnaps = await db.getAll(...songRefs);

  const songDataWithArtist = await Promise.all(songSnaps.map(async (snap) => {
    const songData = snap.data();
    const artistId = songData.artistId;
    
    const artistSnap = await db.collection('artists').doc(artistId).get();
    const artistName = artistSnap.exists ? artistSnap.data().name : "Unknown Artist";

    return {
      id: snap.id,
      title: songData.title,
      artist: artistName
    };
  }));

  return songDataWithArtist;
};

const fetchArtistDataByIds = async (ids) => {
  if (!ids || ids.length === 0) return [];
  const artistRefs = ids.map(id => db.collection('artists').doc(id)); 
  const artistSnaps = await db.getAll(...artistRefs);
  return artistSnaps.map(snap => ({
    id: snap.id,
    name: snap.data().name  
  }));
};

// Route to get user data
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userDoc.data();

    const [likedSongsData, topSongsData, topArtistsData] = await Promise.all([
      fetchSongDataByIds(user.likedSongs),
      fetchSongDataByIds(user.topSongs),
      fetchArtistDataByIds(user.topArtists)
    ]);

    res.json({
      ...user,
      likedSongs: likedSongsData,
      topSongs: topSongsData,
      topArtists: topArtistsData
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
