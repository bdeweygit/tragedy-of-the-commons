const mongoose = require('mongoose');

// a schema to represent pixels on a canvas
const Pixel = new mongoose.Schema({
  row: Number,
  col: Number,
  color: String
});

// a schema to represent a canvas and the state of its pixels
const Canvas = new mongoose.Schema({
  title: String,
  password: String,
  rows: Number,
  cols: Number,
  pixels: [Pixel]
});

// create the Canvas model for later use in other files
mongoose.model('Canvas', Canvas);

// NOTE execute this file before using the Canvas model by calling require('db.js');
