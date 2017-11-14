const port = process.env.PORT || 3000;

require('./db');

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const Canvas = mongoose.model('Canvas');
const Password = mongoose.model('Password');
const rows = 350;
const cols = 700;
const defaultCanvasTitle = 'TRAGEDY OF THE COMMONS';

const blankPixels = (() => {
  const arr = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      arr.push('white');
    }
  }
  return arr;
}).call();

const joinRoom = (socket, room) => {
  // slice(1) because first index is socket's Id
  const rooms = Object.keys(socket.rooms).slice(1);
  rooms.forEach(oldRoom => socket.leave(oldRoom));
  socket.join(room);
};

const titleIsAvail = (title, onAvail) => {
  Canvas.findOne({ title }, (err, canvas) => {
    onAvail(title !== '' && !canvas);
  });
};

const makePassword = password => {
  const salt = bcrypt.genSaltSync(1);
  const hash = bcrypt.hashSync(password, salt);
  return new Password({
    hash,
    salt
  });
};

const makeCanvas = (title, password) => new Canvas({
  title,
  rows,
  cols,
  pixels: blankPixels,
  password: password ? makePassword(password) : null
});

const makeAndSaveCanvas = (title, password, cb) => {
  const canvas = makeCanvas(title, password);
  canvas.save((err, doc) => {
    cb(doc);
  });
};

const configureOnCreate = socket => {
  socket.on('create', ({ title, password }, ackFn) => {
    title = title.trim();

    if (!title) {
      ackFn(false);
    } else {
      titleIsAvail(title, avail => {
        if (avail) {
          ackFn(true);
          makeAndSaveCanvas(title, password, doc => {
            socket.emit('canvas', { canvas: doc });
          });
        } else {
          ackFn(false);
        }
      });
    }
  });
};

const configureOnJoin = socket => {
  socket.on('join', ({ title, password }, ackFn) => {
    Canvas.findOne({ title }, (err, canvas) => {
      const payload = {
        canvas: null,
        error: {
          title: false,
          password: false
        }
      };

      if (canvas) {
        if (canvas.password) {
          if (password) {
            const salt = canvas.password.salt;
            const hash = bcrypt.hashSync(password, salt);
            if (hash === canvas.password.hash) {
              payload.canvas = canvas;
              joinRoom(socket, canvas._id);
            } else {
              payload.error.password = true;
            }
          } else {
            payload.error.password = true;
          }
        } else {
          payload.canvas = canvas;
          joinRoom(socket, canvas._id);
        }
      } else {
        payload.error.title = true;
      }
      ackFn(payload);
    });
  });
};

const configureOnPixel = socket => {
  socket.on('pixel', ({ color, index, _id, passHash }) => {
    const query = { _id, 'password.hash': passHash };
    const doc = { $set: { [`pixels.${index}`]: color } };
    const cb = () => io.sockets.to(_id).emit({ color, index });
    Canvas.findOneAndUpdate(query, doc, cb);
  });
};

const configureIo = defaultCanvas => {
  io.on('connection', socket => {
    joinRoom(socket, defaultCanvas._id);
    socket.emit('canvas', { canvas: defaultCanvas });

    configureOnCreate(socket);
    configureOnJoin(socket);
    configureOnPixel(socket);
  });
};

const configureApp = () => {
  app.use(express.urlencoded({ extended: false }));
  app.use(express.static(path.resolve(__dirname, '..', 'web/build')));

  app.get('/', (req, res) =>
    res.sendFile(path.resolve(__dirname, '..', 'web/build', 'index.html')));

  app.get('*', (req, res) => res.redirect('/'));
};

const startServer = defaultCanvas => {
  configureIo(defaultCanvas);
  configureApp();
  server.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
};

const init = () => {
  Canvas.findOne({ title: defaultCanvasTitle }, (error, defaultCanvas) => {
    if (!defaultCanvas) {
      makeAndSaveCanvas(defaultCanvasTitle, null, doc => startServer(doc));
    } else {
      startServer(defaultCanvas);
    }
  });
};

init();
