// Import the express module
const express=require('express');
// Create an instance of the express application
const app=express();
// Specify a port number for the server
const port=5050;
// Start the server and listen to the port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
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