# 🎵 Spotify Social Web Extension – Spotivibe

## 📖 Project Description

This project is a Spotify-integrated web application developed as part of a summer internship challenge. The goal is to extend Spotify’s social features by building a platform where users can view and share their music tastes, interact through message boards, and connect via private messaging. Built using **React**, **Express**, and **Firebase**, the app consumes the **Spotify API** to create a fully interactive experience.

## 📑 Table of Contents

- [Installation](#installation)
- [External Setup](#external-setup)
- [How to Use Project](#how-to-use-project)
- [Major Components and Features](#major-components-and-features)
- [Feature Status](#feature-status)
- [Credits](#credits)

## 🚀 Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-username/spotify-social-app.git
   cd spotify-social-app
   ```

2. **Install Dependencies**:

   - Backend:
     ```bash
     cd backend
     npm install
     ```
   - Frontend:
     ```bash
     cd ../frontend
     npm install
     ```

3. **Environment Setup**:
   Create a `.env` file in both the frontend and backend directories. Example:

   ```env
   SPOTIFY_CLIENT_ID=your_client_id
   SPOTIFY_CLIENT_SECRET=your_client_secret
   FIREBASE_API_KEY=your_firebase_key
   ```

4. **Run the App**:
   - Backend:
     ```bash
     npm start
     ```
   - Frontend:
     ```bash
     npm start
     ```

## 🌐 External Setup

- **Spotify Developer Account**: Set up your app credentials at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
- **Firebase Project**: Initialize your Firebase project at [Firebase Console](https://console.firebase.google.com/).
- **Authentication Setup**: Ensure Spotify OAuth is configured and integrated on the Express server.

## 🧭 How to Use Project

1. **Login** using Spotify credentials.
2. **Explore**:
   - View your top songs and artists over different time ranges.
   - Discover other users’ public profiles.
   - Engage in forum discussions or send direct messages.
3. **Profile Management**:
   - Customize your profile with preferred music stats.
   - Toggle between public and private visibility.
4. **Interact**:
   - Post and like messages in forums.
   - Search for and join various discussion boards.

## 🛠️ Major Components and Features

| Component                   | Description                                                             |
| --------------------------- | ----------------------------------------------------------------------- |
| **Liked Songs Page**        | Shows user's liked songs with album artwork.                            |
| **Top Artists/Songs Pages** | Displays user's top artists/songs (All Time, Last Year, Last Month).    |
| **User Profile Page**       | Editable profile with visibility settings and music stat display.       |
| **Discover Page**           | Explore public user profiles and send messages.                         |
| **Inbox Page**              | Chat interface showing message threads.                                 |
| **Forum Page**              | Browse and post in discussion boards; search and like posts.            |
| **Authentication**          | Spotify OAuth login integration.                                        |
| **Backend API**             | Express.js server to handle all external API and Firebase interactions. |
| **Database**                | Firebase used for user profiles, messages, and forum posts.             |

## 📈 Feature Status

| Feature               | Status         |
| --------------------- | -------------- |
| Spotify Login         | ✅ Completed   |
| Music Stats Display   | ✅ Completed   |
| Profile Management    | ✅ Completed   |
| Messaging             | ✅ Completed   |
| Forums                | ✅ Completed   |
| Forum Search & Likes  | ✅ Completed   |
| Mobile Responsiveness | ✅ In Progress |
| Unique App Branding   | ✅ Completed   |

## 🙌 Credits

- Intern Dev Team 4– Launch SWE 2025
- Forge & Spotify Mentors
- Project Mentors & Reviewers
- Special thanks to:
  - [Spotify API Documentation](https://developer.spotify.com/documentation/web-api/)
  - [Firebase Docs](https://firebase.google.com/docs)
  - [Express.js](https://expressjs.com/)
