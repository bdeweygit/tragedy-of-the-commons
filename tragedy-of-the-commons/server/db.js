const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

// a schema to represent pixels on a canvas
// const Pixel = new mongoose.Schema({
//   //row: { type: Number, required: true },
//   //col: { type: Number, required: true },
//   color: { type: String, required: true }
// });

// a schema to represent a canvas and the state of its pixels
const Canvas = new mongoose.Schema({
  title: { type: String, required: true },
  password: { type: String, required: false, default: null },
  rows: { type: Number, required: true },
  cols: { type: Number, required: true },
  pixels: { type: [String], required: true }
});
Canvas.plugin(URLSlugs('title'));

// create the models for later use in other files
mongoose.model('Canvas', Canvas);
//mongoose.model('Pixel', Pixel);

// NOTE execute this file before using the Canvas model by calling require('db.js');
mongoose.connect('mongodb://localhost/tragedy-of-the-commons');
