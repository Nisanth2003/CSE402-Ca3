
const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));


let dbo;


const url = "mongodb://localhost:27017/";
MongoClient.connect(url)
  .then((db) => {
    dbo = db.db("mydb1");
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log('Failed to connect to MongoDB:', err);
  });


app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post('/register', (req, res) => {

  const userData = {
    username: req.body.username,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    gender: req.body.gender,
    qualification: req.body.qualification,
  
  };


  dbo.collection("users").insertOne(userData)
    .then(() => {
      console.log("1 document inserted");
      res.send("Your data submitted successfully");
    })
    .catch((err) => {
      console.error("Error inserting data:", err);
      res.status(500).send("Error submitting data");
    });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
