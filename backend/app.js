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

const loginRouter = require("./server/login");
app.use("/login", loginRouter);
app.use("/api/user", userRoute);

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