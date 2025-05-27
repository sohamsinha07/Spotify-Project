// Import the express module
const express=require('express');
const https=require('https');
const fs=require('fs');
// Create an instance of the express application
const app=express();
// Specify a port number for the server
const port=5050;
// Start the server and listen to the port
const options = {
  key: fs.readFileSync("test-spotify-site.local-key.pem"),
  cert: fs.readFileSync("test-spotify-site.local.pem"),
};

https.createServer(options, app).listen(port, () => {
  console.log(
    `HTTPS Server is running on https://test-spotify-site.local:${port}`
  );
});
// use middleware to parse json request bodies
app.use(express.json());

app.get("/posts", (req, res) => {
    let ret = [];
    res.send('This is a Hardcoded GET response ')
    //res.status(200).json(ret);
});

app.get("/posts/:id", (req, res) => {
    const id = req.params.id;
});

app.post("/posts", (req, res) => {
    const data = req.body
});