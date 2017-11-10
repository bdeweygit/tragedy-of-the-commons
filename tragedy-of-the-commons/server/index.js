const port = process.env.PORT || 3000;

require('./db');

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const Canvas = mongoose.model('Canvas');
const rows = 350;
const cols = 700;

const blankPixels = (() => {
  const arr = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      arr.push('white');
    }
  }
  return arr;
}).call();

const getNewCanvas = title => new Canvas({ title, rows, cols, pixels: blankPixels });

const configureNamespace = slug => {
  const nsp = io.of(`/${slug}`);
  nsp.on('connection', socket => {
    Canvas.findOne({ slug }, (err, canvas) => {
      if (!err) {
        socket.on('updatePixel', ({ color, index }) => {
          nsp.emit('pixel', { color, index });
          const update = { $set: { [`pixels.${index}`]: color } };
          Canvas.update({ slug }, update, () => {});
        });

        socket.emit('canvas', canvas);
      }
    });
  });
};

const configureApp = () => {
  app.get('/', (req, res) => res.redirect('/default'));

  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(path.resolve(__dirname, '..', 'web/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '..', 'web/build', 'index.html')));

  app.post('/create', (req, res) => {
    const title = req.body.title;

    const newCanvas = getNewCanvas(title);
    newCanvas.save(() => {
      configureNamespace(newCanvas.slug);
      res.redirect(`/${newCanvas.slug}`);
    });
  });
};

const startServer = () => {
  server.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
};

Canvas.findOne({ title: 'default' }, (findErr, defCanvas) => {
  configureNamespace('default');
  configureApp();

  if (!defCanvas) {
    getNewCanvas('default').save(() => startServer());
  } else {
    startServer();
  }
});
