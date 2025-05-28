const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const serviceAccount = require('./test-spotify-site.local-key.pem');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());

// Add or ensure user exists
app.post('/add-user', async (req, res) => {
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
app.post('/get-or-create-chat', async (req, res) => {
  const { user1, user2 } = req.body;
  try {
    const chatRef = db.collection('chats');
    const snapshot = await chatRef
      .where('participants', 'in', [
        [user1, user2],
        [user2, user1],
      ])
      .get();

    let chatId;
    if (!snapshot.empty) {
      chatId = snapshot.docs[0].id;
    } else {
      const newChat = await chatRef.add({
        participants: [user1, user2],
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
app.post('/send-message', async (req, res) => {
  const { chatId, senderId, text } = req.body;
  try {
    const chatRef = db.collection('chats').doc(chatId);
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
app.get('/messages/:chatId', async (req, res) => {
  const { chatId } = req.params;
  try {
    const doc = await db.collection('chats').doc(chatId).get();
    const data = doc.data();
    res.status(200).json(data?.messages || []);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to get messages');
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
