const express = require("express");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const userRoute = require("./server/userRoute");
const loginRouter = require("./server/login");

const app = express();
const port = 5050;

app.use(express.json());
app.use(cors());

app.use("/login", loginRouter);
app.use("/api/user", userRoute);

const options = {
  key: fs.readFileSync("test-spotify-site.local-key.pem"),
  cert: fs.readFileSync("test-spotify-site.local.pem"),
};

https.createServer(options, app).listen(port, () => {
  console.log(`HTTPS Server is running on https://test-spotify-site.local:${port}`);
});
