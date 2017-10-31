import React from 'react';

const pixelSize = 2;

export default class PixelCanvas extends React.Component {
  constructor(props) {
    super(props);

    props.socket.on('updatePixel', ({ row, col, color }) => {
      this.props.pixelMatrix[row][col].color = color;

      const ctx = this.refs.canvas.getContext('2d');
      ctx.fillStyle = color;
      ctx.fillRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize);
    });

    let color = 'red'
    setInterval(() => {
      props.socket.emit('updatePixel', { row: 50, col: 50, color });
      color = color === 'red' ? 'blue' : 'red';
    }, 500);
  }

  componentDidMount() {
    const ctx = this.refs.canvas.getContext('2d');
    this.props.pixelMatrix.forEach(row => row.forEach(({ row, col, color}) => {
      ctx.fillStyle = color;
      ctx.fillRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize);
    }));
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
