import React from 'react';
import { ScrollView } from 'react-native';
import PixelCanvas from './PixelCanvas';

const pixelSize = 6;

export default class PixelCanvasScrollView extends React.Component {
  constructor(props) {
    super(props);
    this.height = props.canvas.rows * pixelSize;
    this.width = props.canvas.cols * pixelSize;
  }

  componentDidMount() {
    setTimeout(() => {
      const options = {
        x: 0,
        y: 0,
        width: this.width + (pixelSize * 150),
        height: this.height + (pixelSize * 150),
        animated: false
      };
      this.refs.scrollView.scrollResponderZoomTo(options);
    }, 8);
  }

  render() {
    const { socket, canvas, style } = this.props;
    return (
      <ScrollView
        ref='scrollView'
        centerContent
        maximumZoomScale={20}
        minimumZoomScale={0.1}
        style={[{ backgroundColor: '#efefef', width: '100%', height: '100%' }, style]}
        contentContainerStyle={{
          width: this.width + (pixelSize * 20),
          height: this.height + (pixelSize * 20),
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <PixelCanvas
          width={this.width}
          height={this.height}
          canvas={canvas}
          pixelSize={pixelSize}
          socket={socket}
        />
      </ScrollView>
    );
  }
}
