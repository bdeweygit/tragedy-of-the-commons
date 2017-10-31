import React from 'react';
import { View } from 'react-native';
import Canvas from 'react-native-canvas';

export default class PixelCanvas extends React.Component {

  componentDidMount() {
    const pixelSize = this.props.pixelSize;
    const ctx = this.refs.canvas.getContext('2d');
    ctx.fillStyle = 'purple';
    ctx.fillRect(0, 0, pixelSize, pixelSize);
  }

  convertLocationToPosition(location) {
    const { pixelSize } = this.props;
    return Math.floor(location - (location % pixelSize)) / pixelSize;
  }

  render() {
    const { width, height, toggleColorSelector, pixelSize, socket } = this.props;
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
          socket.emit('updatePixel', { row, col, color: 'black' });
          console.log(col, row);
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
