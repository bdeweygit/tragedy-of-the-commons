const app = require('./app');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

const getPixelMatrix = () => { // TODO get it from MongoDB
  const rows = 350;
  const cols = 700;
  const pixelMatrix = [];
  for (let row = 0; row < rows; row++) {
    pixelMatrix.push([]);
    for (let col = 0; col < cols; col++) {
      pixelMatrix[row].push({
        row,
        col,
        color: 'white'
      });
    }
  }

  pixelMatrix[120][120].color = 'green';
  pixelMatrix[120][121].color = 'black';
  pixelMatrix[0][0].color = 'purple';
  const lastRow = pixelMatrix.length - 1;
  const lastCol = pixelMatrix[lastRow].length - 1;
  pixelMatrix[lastRow][lastCol].color = 'purple';

  return pixelMatrix;
};

io.on('connection', socket => {
  // emit the current pixel matrix
  socket.emit('pixelMatrix', getPixelMatrix());

  socket.on('updatePixel', data => {
    // update MongoDB then emit to all sockets
    io.sockets.emit('updatePixel', data);
  });
});

http.listen(port, () => {
  console.log('listening on port ' + port);
});
