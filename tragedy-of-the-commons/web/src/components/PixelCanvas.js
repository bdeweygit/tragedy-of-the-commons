import React from 'react';

export default class PixelCanvas extends React.Component {
  drawCanvas() {
    const pixelSize = this.props.pixelSize;
    const htmlCanvas = this.htmlCanvas;
    const cols = this.props.cols
    const ctx = htmlCanvas.getContext('2d');

    ctx.clearRect(0, 0, htmlCanvas.width, htmlCanvas.height);

    this.props.canvas.pixels.forEach((color, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      ctx.fillStyle = color;
      ctx.fillRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize);
    });
  }

  componentDidMount() {
    this.drawCanvas();
    this.props.onMount(this.htmlCanvas);
  }

  shouldComponentUpdate({ canvas }) {
    return canvas._id !== this.props.canvas._id;
  }

  componentDidUpdate() {
    this.drawCanvas();
  }

  render() {
    const { className, rows, cols, pixelSize } = this.props;
    return (
      <canvas
        className={className}
        width={cols * pixelSize}
        height={rows * pixelSize}
        ref={htmlCanvas => this.htmlCanvas = htmlCanvas}
      />
    );
  }
}
