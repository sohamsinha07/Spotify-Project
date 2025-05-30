const express = require("express");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const { db } = require("./firebaseAdmin");
const userRoute = require("./server/userRoute");

const app = express();
const port = 5050;

app.use(express.json());
app.use(cors());

const inboxRouter = require("./server/inbox");
app.use("/inbox", inboxRouter);

const loginRouter = require("./server/login");
const profileEditRouter = require('./server/profileEdit');
const forumRoute = require('./server/forumRoute');
app.use('/api/forum', forumRoute);
app.use("/login", loginRouter);
app.use("/api/user", userRoute);
app.use('/api', profileEditRouter);

// HTTPS configuration with mkcert
const options = {
  key: fs.readFileSync("test-spotify-site.local-key.pem"),
  cert: fs.readFileSync("test-spotify-site.local.pem"),
};

https.createServer(options, app).listen(port, () => {
  console.log(
    `HTTPS Server is running on https://test-spotify-site.local:${port}`
  );
});