const mongoose = require('mongoose');

//Connection to database - MongoDB Atlas
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {console.log("Connected to MongoDB")});

//Schema to store url and short url in database
let urlSchema = new mongoose.Schema({
  urlCode: String,
  longUrl: String,
  shortUrl: String
});

module.exports = mongoose.model('Url', urlSchema);