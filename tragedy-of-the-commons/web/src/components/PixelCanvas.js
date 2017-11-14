import React from 'react';

const pixelSize = 2;

export default class PixelCanvas extends React.Component {
  constructor(props) {
    super(props);

    props.socket.on('pixel', ({ color, index }) => {
      const cols = this.props.cols;

      const row = Math.floor(index / cols);
      const col = index % cols;
      const ctx = this.refs.canvas.getContext('2d');
      ctx.fillStyle = color;
      ctx.fillRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize);
    });

    // let color = 'red'
    // setInterval(() => {
    //   props.socket.emit('updatePixel', { color, index: 0 });
    //   color = color === 'red' ? 'blue' : 'red';
    // }, 500);
  }

  componentDidMount() {
    const cols = this.props.cols

    const ctx = this.refs.canvas.getContext('2d');
    this.props.canvas.pixels.forEach((color, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      ctx.fillStyle = color;
      ctx.fillRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize);
    });
  }

  render() {
    const { className, rows, cols } = this.props;
    return (
      <canvas
        className={className}
        ref='canvas'
        width={cols * pixelSize}
        height={rows * pixelSize}
      />
    );
  }
}
