const db = require("../firebaseAdmin");
const express = require('express');
// const cors = require('cors');
const admin = require('firebase-admin');
const router = express.Router();
// const { getDocs, collection } = require("firebase/firestore")


// import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };


// Add or ensure user exists
router.post('/add-user', async (req, res) => {
  const { userId } = req.body;
  try {
    const userRef = db.collection('users').doc(userId);
    const docSnap = await userRef.get();
    if (!docSnap.exists) {
      await userRef.set({ username: userId });
    }
    res.status(200).send('User ensured');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to add user');
  }
});

// Get or create chat
router.post('/get-or-create-chat', async (req, res) => {
  const { user1, user2 } = req.body;
  try {
    const chatRef = db.collection('chat');
    const participants = [user1, user2].sort(); // Always sorted
    const snapshot = await chatRef
    .where('participants', '==', participants)
    .get();

    if (!snapshot.empty) {
    chatId = snapshot.docs[0].id;
    } else {
      const newChat = await chatRef.add({
        participants,
        messages: [],
      });
      chatId = newChat.id;
    }

    res.status(200).json({ chatId });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to get/create chat');
  }
});

// Send a message
router.post('/send-message', async (req, res) => {
  const { chatId, senderId, text } = req.body;
  try {
    const chatRef = db.collection('chat').doc(chatId);
    await chatRef.update({
      messages: admin.firestore.FieldValue.arrayUnion({
        senderId,
        text,
        timestamp: Date.now(),
      }),
    });
    res.status(200).send('Message sent');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to send message');
  }
});

// Get messages
router.get('/messages/:chatId', async (req, res) => {
  const { chatId } = req.params;
  try {
    const doc = await db.collection('chat').doc(chatId).get();
    const data = doc.data();
    res.status(200).json(data?.messages || []);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to get messages');
  }
});

router.get("/users", async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();
    const userList = snapshot.docs.map((doc) => doc.id);
    res.status(200).json(userList);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    res.status(500).send("Failed to fetch users");
  }
});

router.delete("/delete-chat", async (req, res) => {
  const { user1, user2 } = req.body;

  try {
    const participants = [user1, user2].sort();
    const snapshot = await db.collection("chat").where("participants", "==", participants).get();

    if (!snapshot.empty) {
      const chatId = snapshot.docs[0].id;
      await db.collection("chat").doc(chatId).delete();
      res.status(200).send("Chat deleted");
    } else {
      res.status(404).send("Chat not found");
    }
  } catch (err) {
    console.error("Failed to delete chat", err);
    res.status(500).send("Failed to delete chat");
  }
});


module.exports = router;

