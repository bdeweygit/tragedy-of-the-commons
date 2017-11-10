import React from 'react';
import { View } from 'react-native';
import Canvas from 'react-native-canvas';

export default class PixelCanvas extends React.Component {

  componentDidMount() {
    const { cols, pixels } = this.props.canvas;
    const pixelSize = this.props.pixelSize;
    const ctx = this.refs.canvas.getContext('2d');
    console.log(pixels.length, pixels[0]);
    pixels.forEach((color, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;

      ctx.fillStyle = color;
      ctx.fillRect(col, row, pixelSize, pixelSize);
    });
  }

  convertLocationToPosition(location) {
    const { pixelSize } = this.props;
    return Math.floor(location - (location % pixelSize)) / pixelSize;
  }

  render() {
    const { width, height, toggleColorSelector, pixelSize, socket, canvas } = this.props;
    return (
      <View
        style={{
          width,
          height,
          shadowRadius:
          pixelSize * 5,
          shadowColor: 'black',
          shadowOpacity: 1
        }}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={() => console.log('granted')}
        onResponderReject={() => console.log('rejected')}
        onResponderRelease={event => {
          toggleColorSelector();
          const { locationX, locationY } = event.nativeEvent;
          const col = this.convertLocationToPosition(locationX);
          const row = this.convertLocationToPosition(locationY);
          const index = col + (row * canvas.cols);
          socket.emit('updatePixel', { index, color: 'black' });
        }}
      >
        <Canvas
          ref={'canvas'}
          style={{ width, height, backgroundColor: 'white' }}
        />
      </View>
    );
  }
}
