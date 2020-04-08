'use strict';

const express = require('express');
const mongo = require('mongodb');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // so that your API is remotely testable by FCC 
const shortid = require('shortid'); //Create id code for URL shortener
const validUrl = require('valid-url'); //Validate URL
const Url = require('./models/url.model');

let app = express();

//Middleware for FreeCodeCamp
app.use(cors());

// Mount the body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Apply css styles to html.file
app.use('/public', express.static(process.cwd() + '/public'));

//Send html file when the link to the webpage is entered
app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html');
});

// User story 1 - I can POST a URL to [project_url]/api/shorturl/new and I will receive a shortened URL in the JSON response.
// Example : {"original_url":"www.google.com","short_url":1}
app.post("/api/shorturl/new", async (req, res) => {
  let longUrl = req.body.url;
  let baseUrl = 'https://url-shortener-lb.glitch.me/api/shorturl';

  // Create url code
  const urlCode = shortid.generate();

  // Check long url
  if (validUrl.isUri(longUrl)) {
    try {
      let url = await Url.findOne({ longUrl });

      if (url) { //If found, send the exisiting information in the database
        res.json({'original_Url': url.longUrl, 'short_Url': url.shortUrl});
      } else { //if not found, create new record in database
        let shortUrl = baseUrl + '/' + urlCode;

        url = new Url({
          longUrl,
          shortUrl,
          urlCode
        });

        await url.save();

        res.json({'original_Url': url.longUrl, 'short_Url': url.shortUrl});
      }
    } catch (err) {
      console.error(err);
      res.status(500).json('Server error');
    }
// User story 2 - If I pass an invalid URL that doesn't follow the http(s)://www.example.com(/more/routes) format, 
// the JSON response will contain an error like {"error":"invalid URL"}
  } else {
    res.status(401).json({'error': 'Invalid long url'});
  }
});


// User story 3 - When I visit the shortened URL, it will redirect me to my original link.
app.get("/api/shorturl/:short", async (req, res) => {
  const short = req.params.short;
  let url = await Url.findOne({urlCode: short});
  
  if (url) {
    res.redirect(url.longUrl);
  } else {
    res.status(404).json({'error': 'URL not found'});
  }
});

//Listen for requests
const PORT = process.env.PORT || 3000; // variable that stores the port - either the one in .env or port 3000
app.listen(PORT, () => console.info(`Server has started on ${PORT}`));