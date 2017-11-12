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

const configureUpdatePixelEvent = (nsp, socket, slug) => {
  socket.on('updatePixel', ({ color, index }) => {
    nsp.emit('pixel', { color, index });
    const update = { $set: { [`pixels.${index}`]: color } };
    Canvas.update({ slug }, update, () => {});
  });
};

const newCanvasTitleIsValid = (title, onValid) => {
  Canvas.findOne({ title: title.trim() }, (err, canvas) => {
    onValid(title.trim() !== '' && !canvas);
  });
};

const configureValidateNewTitleEvent = socket => {
  socket.on('validateNewTitle', (title, fn) => {
    newCanvasTitleIsValid(title.trim(), fn);
  });
};

const configureFindCanvasByTitleEvent = socket => {
  socket.on('findCanvas', (title, fn) => {
    Canvas.findOne({ title: title.trim() }, (err, canvas) => {
      fn(canvas ? canvas.slug : false);
    });
  });
};

const configureNamespace = slug => {
  const nsp = io.of(`/${slug}`);
  nsp.on('connection', socket => {
    Canvas.findOne({ slug }, (err, canvas) => {
      if (!err) {
        configureValidateNewTitleEvent(socket);
        configureFindCanvasByTitleEvent(socket);

        // if canvas is public
        if (!canvas.password) {
          configureUpdatePixelEvent(nsp, socket, slug);
          socket.emit('canvas', canvas);
        } else {
          // configure accessPrivateCanvasEvent
          // socket emit 'private'
        }
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

  app.post('*', (req, res) => {
    const title = req.body.title;
    newCanvasTitleIsValid(title, valid => {
      if (valid) {
        const newCanvas = getNewCanvas(title.trim());
        newCanvas.save(() => {
          configureNamespace(newCanvas.slug);
          res.redirect(`/${newCanvas.slug}`);
        });
      } else {
        res.end();
      }
    });
  });
};

const startServer = () => {
  configureApp();
  server.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
};

Canvas.findAlias = Canvas.find; // esLint assumes .find is for arrays and wants a return value
Canvas.findAlias((err, canvases) => {
  canvases.forEach(({ slug }) => configureNamespace(slug));

  Canvas.findOne({ title: 'default' }, (findErr, defCanvas) => {
    if (!defCanvas) {
      configureNamespace('default');
      getNewCanvas('default').save(() => startServer());
    } else {
      startServer();
    }
  });
});
