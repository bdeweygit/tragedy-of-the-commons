const mongoose = require('mongoose');

const Pixel = new mongoose.Schema({
  row: Number,
  col: Number,
  color: String
});

const Canvas = new mongoose.Schema({
  title: String,
  password: String,
  rows: Number,
  cols: Number,
  pixels: [Pixel]
});

mongoose.model('Canvas', Canvas);

mongoose.connect('mongodb://localhost/tragedy-of-the-commons');
