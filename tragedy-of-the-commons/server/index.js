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

const blankPixels = (() => {
  const arr = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      arr.push('white');
    }
  }
  return arr;
}).call();

const getNewPassword = password => {
  const salt = bcrypt.genSaltSync(1);
  const hash = bcrypt.hashSync(password, salt);
  return new Password({
    hash,
    salt
  });
};

const getNewCanvas = (title, password) => new Canvas({
  title,
  rows,
  cols,
  pixels: blankPixels,
  password: password ? getNewPassword(password) : null
});

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
  socket.on('validateNewTitle', (title, ackFn) => {
    newCanvasTitleIsValid(title.trim(), ackFn);
  });
};

const configureFindCanvasByTitleEvent = socket => {
  socket.on('findCanvas', (title, ackFn) => {
    Canvas.findOne({ title: title.trim() }, (err, canvas) => {
      ackFn(canvas ? canvas.slug : false);
    });
  });
};

const safeCanvas = ({ title, pixels }) => ({ title, pixels, rows, cols });

const configureAccessPrivateCanvasEvent = (nsp, socket, slug) => {
  socket.on('accessPrivateCanvas', (password, ackFn) => {
    Canvas.findOne({ slug }, (err, canvas) => {
      const salt = canvas.password.salt;
      const hash = bcrypt.hashSync(password, salt);
      if (hash === canvas.password.hash) {
        configureUpdatePixelEvent(nsp, socket, slug);
        ackFn(safeCanvas(canvas));
      } else {
        ackFn(false);
      }
    });
  });
};

const configureRequestCanvasEvent = (nsp, socket, slug) => {
  socket.on('requestCanvas', (data, ackFn) => {
    Canvas.findOne({ slug }, (err, canvas) => {
      if (canvas.password) {
        configureAccessPrivateCanvasEvent(nsp, socket, slug);
        ackFn(false);
      } else {
        configureUpdatePixelEvent(nsp, socket, slug);
        ackFn(safeCanvas(canvas));
      }
    });
  });
};

const configureNamespace = slug => {
  const nsp = io.of(`/${slug}`);
  nsp.on('connection', socket => {
    configureRequestCanvasEvent(nsp, socket, slug);
    configureValidateNewTitleEvent(socket);
    configureFindCanvasByTitleEvent(socket);
    socket.emit('ready');
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
    const password = req.body.password;
    newCanvasTitleIsValid(title, valid => {
      if (valid) {
        const newCanvas = getNewCanvas(title.trim(), password);
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
