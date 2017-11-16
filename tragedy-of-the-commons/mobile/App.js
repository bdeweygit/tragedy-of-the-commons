import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { KeepAwake } from 'expo';
import io from 'socket.io-client';
import PixelCanvasScrollView from './components/PixelCanvasScrollView';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { canvas: {} };
  }

  componentDidMount() {
    this.socket = io('http://localhost:3000');
    this.socket.on('canvas', ({ canvas }) => {
      this.setState(prevState => ({ ...prevState, canvas }));
    });
  }

  renderLoader() {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <ActivityIndicator color={'black'} size={'large'} />
        <KeepAwake />
      </View>
    );
  }

  renderTragedy() {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <PixelCanvasScrollView
          canvas={this.state.canvas}
          socket={this.socket}
        />
        <KeepAwake />
      </View>
    );
  }

  render() {
    return Object.keys(this.state.canvas).length > 0 ?
      this.renderTragedy() : this.renderLoader();
  }
}
