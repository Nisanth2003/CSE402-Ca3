const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();
const port = 3000;

const url = 'mongodb://localhost:27017';
const dbName = 'mydb1';

app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

let dbo;
MongoClient.connect(url)
  .then((client) => {
    dbo = client.db(dbName);
    console.log('Connected to MongoDB');
  })
  .catch((err) => console.log('MongoDB connection failed: ', err));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  dbo.collection('users').find({ username, password }).toArray()
    .then((users) => {
      if (users.length > 0) {
        req.session.username = username; 
        res.redirect('/success');
      } else {
        res.redirect('/error');
      }
    })
    .catch((err) => {
      console.log(err);
      res.redirect('/error');
    });
});

app.get('/success', (req, res) => {
  if (req.session.username) {
    res.render('success', { username: req.session.username });
  } else {
    res.redirect('/');
  }
});

app.get('/error', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'error.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
