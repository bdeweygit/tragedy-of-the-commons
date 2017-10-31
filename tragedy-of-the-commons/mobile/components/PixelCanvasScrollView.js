import React from 'react';
import { ScrollView } from 'react-native';
import PixelCanvas from './PixelCanvas';

const pixelSize = 6;

export default class PixelCanvasScrollView extends React.Component {
  constructor(props) {
    super(props);
    this.height = props.pixelMatrix.length * pixelSize;
    this.width = props.pixelMatrix[0].length * pixelSize;
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
    const { socket, toggleColorSelector } = this.props;
    return (
      <ScrollView
        ref='scrollView'
        centerContent
        maximumZoomScale={20}
        minimumZoomScale={0.1}
        style={{ backgroundColor: '#efefef' }}
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
          pixelSize={pixelSize}
          socket={socket}
          toggleColorSelector={toggleColorSelector}
        />
      </ScrollView>
    );
  }
}
