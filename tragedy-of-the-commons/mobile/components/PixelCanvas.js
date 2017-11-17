import React from 'react';
import { View, WebView } from 'react-native';

export default class PixelCanvas extends React.Component {

  constructor(props) {
    super(props);

    const { rows, cols } = props.canvas;
    const pixelSize = props.pixelSize;

    this.html = `
      <!DOCTYPE html>
      <meta
        content='width=device-width,
        initial-scale=1.0,
        maximum-scale=1.0,
        user-scalable=0'
        name='viewport'
      />

      <html>
        <body style="margin: 0">
          <canvas id="myCanvas"
            width="${cols * pixelSize}"
            height="${rows * pixelSize}"
            style="background-color: white; width: 100%; height: 100%"
          />

          <script>
            document.addEventListener("message", ({ data }) => {
              const [ command, payload ] = data.split(":");

              const c = document.getElementById("myCanvas");
              const ctx = c.getContext("2d");

              if (command === "draw") {
                payload.split(',').forEach((color, index) => {
                  const row = Math.floor(index / ${cols}) * ${pixelSize};
                  const col = (index % ${cols}) * ${pixelSize};
                  ctx.fillStyle = color;
                  ctx.fillRect(col, row, ${pixelSize}, ${pixelSize});
                });
              } else if (command === "pixel") {
                const [ color, index ] = payload.split(',');
                const row = Math.floor(index / ${cols}) * ${pixelSize};
                const col = (index % ${cols}) * ${pixelSize};
                ctx.fillStyle = color;
                ctx.fillRect(col, row, ${pixelSize}, ${pixelSize});
              }
            });
          </script>
        </body>
      </html>
    `;
  }

  componentDidMount() {
    // Delay the first postMessage because webview needs to load.
    // Ideally the postMessage would be done in WebView.onLoad but the 
    // callback does not fire as consequence of setting WebView source html.
    // This is a ReactNative bug.
    setTimeout(() => {
      const pixels = this.props.canvas.pixels;
      this.webView.postMessage(`draw:${pixels.toString()}`);
      this.props.socket.on('pixel', ({ color, index }) => {
        this.webView.postMessage(`pixel:${color},${index}`);
      });
    }, 1000);
  }

  shouldComponentUpdate({ canvas, color }) {
    this.color = color;
    return canvas._id !== this.props.canvas._id;
  }

  componentDidUpdate() {
    const pixels = this.props.canvas.pixels;
    this.webView.postMessage(`draw:${pixels.toString()}`);
  }

  convertLocationToPosition(location) {
    const { pixelSize } = this.props;
    return Math.floor(location - (location % pixelSize)) / pixelSize;
  }

  render() {
    const { width, height, pixelSize, socket, canvas } = this.props;
    const { _id, password } = canvas;
    const hash = password ? password.hash : null;
    return (
      <View
        style={{
          width,
          height,
          shadowRadius: pixelSize * 5,
          shadowColor: 'black',
          shadowOpacity: 1,
          shadowOffset: { width: 0, height: 0 }
        }}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderRelease={event => {
          const { locationX, locationY } = event.nativeEvent;
          const col = this.convertLocationToPosition(locationX);
          const row = this.convertLocationToPosition(locationY);
          const index = col + (row * canvas.cols);
          socket.emit('pixel', { index, color: this.color, _id, hash });
        }}
      >
        <WebView
          scrollEnabled={false}
          style={{ width, height }}
          source={{ html: this.html }}
          ref={webView => (this.webView = webView)}
        />
      </View>
    );
  }
}
