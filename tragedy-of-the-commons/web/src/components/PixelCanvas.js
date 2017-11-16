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
  }

  drawCanvas() {
    if (this.refs.canvas) {
      const canvas = this.refs.canvas;
      const cols = this.props.cols
      const ctx = canvas.getContext('2d');

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      this.props.canvas.pixels.forEach((color, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        ctx.fillStyle = color;
        ctx.fillRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize);
      });
    }
  }

  componentDidMount() {
    this.drawCanvas();
  }

  render() {
    this.drawCanvas();
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
