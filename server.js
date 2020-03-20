'use strict';

const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // so that your API is remotely testable by FCC 
const shortid = require('shortid'); //Create id code for URL shortener
const validUrl = require('valid-url'); //Validate URL

var app = express();

//Connection to database - MongoDB Atlas
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {console.log("Connected to MongoDB")});

//Middleware for FreeCodeCamp
app.use(cors());

// Mount the body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Apply css styles to html.file
app.use('/public', express.static(process.cwd() + '/public'));

//Send html file when the link to the webpage is entered
app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

//Schema and model to store url and short url in database
let urlSchema = new mongoose.Schema({
  urlCode: String,
  longUrl: String,
  shortUrl: String
});

let Url = mongoose.model('Url', urlSchema);

// POST request to turn URL into short URL
app.post("/api/shorturl/new", async (req, res) => {
  let longUrl = req.body.url;
  let baseUrl = 'https://glass-ambiguous-look.glitch.me/api/shorturl';

  // Create url code
  const urlCode = shortid.generate();

  // Check long url
  if (validUrl.isUri(longUrl)) {
    try {
      let url = await Url.findOne({ longUrl });

      if (url) { //If found, send the exisiting information in the database
        res.send(url);
      } else { //if not found, create new record in database
        let shortUrl = baseUrl + '/' + urlCode;

        url = new Url({
          longUrl,
          shortUrl,
          urlCode
        });

       await url.save();

      res.json(url);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json('Server error');
    }
  } else {
    res.status(401).json('Invalid long url');
  }
});


//GET request to redirect short URL to the regular URL
app.get("/api/shorturl/:short", async (req, res) => {
  const short = req.params.short;
  let url = await Url.findOne({urlCode: short});
  
  if (url) {
    res.redirect(url.longUrl);
  } else {
    res.status(404).json({"error":"URL not found"});
  }
});

//Listen for requests
const PORT = process.env.PORT || 3000; // variable that stores the port - either the one in .env or port 3000
app.listen(PORT, () => console.info(`Server has started on ${PORT}`));