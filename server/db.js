const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

// a schema to represent a password
const Password = new mongoose.Schema({
  hash: { type: String, required: true },
  salt: { type: String, required: true }
});

// a schema to represent a canvas and the state of its pixels
const Canvas = new mongoose.Schema({
  title: { type: String, required: true },
  rows: { type: Number, required: true },
  cols: { type: Number, required: true },
  pixels: { type: [String], required: true },
  password: { type: Password, required: false, default: null }
});
Canvas.plugin(URLSlugs('title'));

// create the models for later use in other files
mongoose.model('Canvas', Canvas);
mongoose.model('Password', Password);

// NOTE execute this file before using the models by calling require('db.js');


// is the environment variable, NODE_ENV, set to PRODUCTION?
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...

  const fn = path.join(__dirname, 'config.json');
  const data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
  const conf = JSON.parse(data);
  dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://localhost/tragedy-of-the-commons';
}
mongoose.connect(dbconf);
