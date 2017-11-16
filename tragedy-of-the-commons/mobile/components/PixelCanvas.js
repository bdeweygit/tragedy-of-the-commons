import React from 'react';
import { View, WebView } from 'react-native';

export default class PixelCanvas extends React.Component {

  constructor(props) {
    super(props);

    this.webView = null;

    const { pixelSize, canvas } = this.props;
    const { rows, cols, pixels } = canvas;

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
            style="background-color: aqua; width: 100%; height: 100%"
          />

          <script>
            const c = document.getElementById("myCanvas");
            const ctx = c.getContext("2d");
            [${pixels.map(color => `'${color}'`)}].forEach((color, index) => {
              const row = Math.floor(index / ${cols}) * ${pixelSize};
              const col = (index % ${cols}) * ${pixelSize};
              ctx.fillStyle = color;
              ctx.fillRect(col, row, ${pixelSize}, ${pixelSize});
            });

            document.addEventListener("message", ({ data }) => {
              const [ color, index ] = data.split(":");
              const row = Math.floor(index / ${cols}) * ${pixelSize};
              const col = (index % ${cols}) * ${pixelSize};
              ctx.fillStyle = color;
              ctx.fillRect(col, row, ${pixelSize}, ${pixelSize});
            });
          </script>
        </body>
      </html>
    `;
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
          shadowOpacity: 1
        }}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderRelease={event => {
          const { locationX, locationY } = event.nativeEvent;
          const col = this.convertLocationToPosition(locationX);
          const row = this.convertLocationToPosition(locationY);
          const index = col + (row * canvas.cols);
          socket.emit('pixel', { index, color: 'black', _id, hash });
        }}
      >
        <WebView
          scrollEnabled={false}
          style={{ width, height }}
          source={{ html: this.html }}
          ref={webView => (this.webView = webView)}
          onLoadStart={
            () =>
              socket.on('pixel', ({ color, index }) =>
                this.webView.postMessage(`${color}:${index}`))
          }
        />
      </View>
    );
  }
}
