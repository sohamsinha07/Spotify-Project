const express = require("express");
const router = express.Router();
require(`dotenv`).config();
const https = require("https");
const querystring = require("querystring");
const axios = require('axios');
const admin = require('firebase-admin');
const db = admin.firestore();

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const redirectURI = "https://test-spotify-site.local:5050/login/callback";

const generateRandomString = (length) => {
  let text = ``;
  const possible = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`;
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = `spotify_auth_state`;

router.get(`/`, (request, response) => {
  const state = generateRandomString(16);
  response.cookie(stateKey, state);

  const scope = [
    "user-read-private",
    "user-read-email",
    "user-top-read",
    "user-library-read",  
  ].join(" ");

  const queryParams = querystring.stringify({
    client_id: clientId,
    response_type: `code`,
    redirect_uri: redirectURI,
    state: state,
    scope: scope,
  });
  response.redirect(`https://accounts.spotify.com/authorize?${queryParams}`);
});

router.get(`/callback`, async (req, res) => {
  const code = req.query.code || null;

  const postData = querystring.stringify({
    grant_type: `authorization_code`,
    code: code,
    redirect_uri: redirectURI,
  });

  const options = {
    hostname: "accounts.spotify.com",
    path: "/api/token",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(postData),
      Authorization: `Basic ${Buffer.from(
        `${clientId}:${clientSecret}`
      ).toString("base64")}`,
    },
  };

  const request = https.request(options, (response) => {
    let data = "";

    response.on("data", (chunk) => {
      data += chunk;
    });

    response.on("end", async () => {
      try {
        const parsedData = JSON.parse(data);  

        if (response.statusCode === 200) {
          const { access_token, refresh_token, expires_in } = parsedData;
          
          console.log('Access Token:', access_token);

          const userData = await getSpotifyUserData(access_token);
          const likedSongs = await getSpotifyLikedSongs(access_token);
          const topArtists = await getSpotifyTopArtists(access_token); 
          const topSongs = await getSpotifyTopSongs(access_token);

          await saveUserToFirestore(userData, likedSongs, topArtists, topSongs);

          const queryParams = querystring.stringify({
            access_token,
            refresh_token,
            expires_in,
          });

          res.redirect(`http://localhost:5173/?${queryParams}`);
          
        } else {
          console.error('Spotify Response Error:', data);
          res.redirect(`/?${querystring.stringify({ error: `invalid_token` })}`);
        }
      } catch (error) {
        console.error("Error parsing Spotify response:", error);
        res.redirect(`/?${querystring.stringify({ error: `parse_error` })}`);
      }
    });
  });

  request.on("error", (error) => {
    console.error("Request Error:", error);
    res.redirect(`/?${querystring.stringify({ error: `request_error` })}`);
  });

  request.write(postData);
  request.end();
});

const getSpotifyUserData = async (access_token) => {
  const userUrl = 'https://api.spotify.com/v1/me';
  const headers = { Authorization: `Bearer ${access_token}` };

  try {
    const response = await axios.get(userUrl, { headers });
    console.log("User data fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching Spotify user data:", error);
    throw new Error('Failed to fetch user data');
  }
};

const getSpotifyLikedSongs = async (access_token) => {
  const likedSongsUrl = 'https://api.spotify.com/v1/me/tracks'; 
  const headers = {
    Authorization: `Bearer ${access_token}`,
  };

  try {
    const response = await axios.get(likedSongsUrl, { headers });

    console.log("Raw Liked Songs response:", response.data);

    const likedSongs = response.data.items.map(item => {
      const track = item.track;
      if (!track || !track.id) return null; 

      return {
        album: track.album.name,               
        artistId: track.artists[0]?.id || '',  
        imageUrl: track.album.images[0]?.url || '', 
        title: track.name,                    
      };
    }).filter(item => item !== null); 

    return likedSongs;
  } catch (error) {
    console.error("Error fetching liked songs:", error);
    return [];
  }
};


const getSpotifyTopArtists = async (access_token) => {
  const topArtistsUrl = 'https://api.spotify.com/v1/me/top/artists';
  const headers = {
    Authorization: `Bearer ${access_token}`,
  };

  try {
    const response = await axios.get(topArtistsUrl, { headers });

    console.log("Raw Top Artists response:", response.data);

    if (response.data && response.data.items) {
      const topArtists = response.data.items.map(artist => {
        if (!artist || !artist.id || !artist.name) return null;

        return {
          name: artist.name,              
          artistId: artist.id,          
          imageUrl: artist.images[0]?.url || '', 
        };
      }).filter(item => item !== null);

      if (topArtists.length === 0) {
        console.log("No top artists data found for the user.");
      } else {
        console.log("Top Artists:", topArtists); 
      }

      return topArtists;
    } else {
      console.error("Top Artists response is empty or malformed.");
      return []; 
    }
  } catch (error) {
    console.error("Error fetching top artists:", error);
    return []; 
  }
};




const getSpotifyTopSongs = async (access_token) => {
  const topSongsUrl = 'https://api.spotify.com/v1/me/top/tracks';
  const headers = {
    Authorization: `Bearer ${access_token}`,
  };

  try {
    const response = await axios.get(topSongsUrl, { headers });

    console.log("Raw Top Songs response:", response.data);

    const topSongs = response.data.items.map(song => {
      const track = song;
      if (!track || !track.id) return null; 

      return {
        album: track.album.name,             
        artistId: track.artists[0]?.id || '',  
        imageUrl: track.album.images[0]?.url || '',
        title: track.name,                 
      };
    }).filter(item => item !== null);

    return topSongs;
  } catch (error) {
    console.error("Error fetching top songs:", error);
    return []; 
  }
};


const saveUserToFirestore = async (userData, likedSongs, topArtists, topSongs) => {
  const userRef = db.collection('users').doc(userData.id);

  await userRef.set({
    username: userData.display_name,
    email: userData.email,
    profilePictureUrl: userData.images[0]?.url || '',
    spotifyId: userData.id,
    bio: userData.bio || "Hi! I'm a Spotify user.",
  }).then(() => {
    console.log('User saved to Firestore');
  }).catch(err => {
    console.error('Error saving user to Firestore:', err);
  });

  const songReferences = new Set();
  const artistReferences = new Set();

  for (let song of likedSongs) {
    const existingSongQuery = await db.collection('songs').where('artistId', '==', song.artistId).where('title', '==', song.title).limit(1).get();

    if (existingSongQuery.empty) {
      const songRef = await db.collection('songs').add({
        album: song.album,
        artistId: song.artistId,
        imageUrl: song.imageUrl,
        title: song.title,
      });

      songReferences.add(songRef.id);
    } else {
      songReferences.add(existingSongQuery.docs[0].id);
    }
  }

  for (let song of topSongs) {
    const existingSongQuery = await db.collection('songs').where('artistId', '==', song.artistId).where('title', '==', song.title).limit(1).get();

    if (existingSongQuery.empty) {
      const songRef = await db.collection('songs').add({
        album: song.album,
        artistId: song.artistId,
        imageUrl: song.imageUrl,
        title: song.title,
      });

      songReferences.add(songRef.id);
    } else {
      songReferences.add(existingSongQuery.docs[0].id);
    }
  }

  for (let artist of topArtists) {
    console.log("Checking artist:", artist);

    const existingArtistQuery = await db.collection('artists').where('artistId', '==', artist.artistId).limit(1).get();

    if (existingArtistQuery.empty) {
      console.log("Adding new artist:", artist.name);
      
      const artistRef = await db.collection('artists').add({
        name: artist.name,
        artistId: artist.artistId,
        imageUrl: artist.imageUrl,
      });

      artistReferences.add(artistRef.id);
    } else {
      console.log("Artist already exists:", artist.name);
      artistReferences.add(existingArtistQuery.docs[0].id);
    }
  }

  await userRef.update({
    likedSongs: Array.from(songReferences),
    topArtists: Array.from(artistReferences),
    topSongs: Array.from(songReferences),
  });

  console.log('User with song, artist, and song references saved to Firestore:', userData.id);
};



module.exports = router;
