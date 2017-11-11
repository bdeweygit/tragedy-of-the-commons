import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { KeepAwake } from 'expo';
import io from 'socket.io-client';
import PixelCanvasScrollView from './components/PixelCanvasScrollView';
//import ColorSelector from './components/ColorSelector';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { canvas: {}, colorSelectorVisible: false };
  }

  componentDidMount() {
    this.socket = io('http://linserv2.cims.nyu.edu:11601/default');
    this.socket.on('canvas', canvas => {
      this.setState(prevState => ({ ...prevState, canvas }));
    });
  }

  toggleColorSelector() {
    this.setState(prevState => ({
      ...prevState,
      colorSelectorVisible: !prevState.colorSelectorVisible
    }));
  }

  renderLoader() {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <ActivityIndicator color={'black'} size={'large'} />
        <KeepAwake />
      </View>
    );
  }
  //{this.state.showColorSelector ? <ColorSelector /> : null}
  renderTragedy() {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <PixelCanvasScrollView
          canvas={this.state.canvas}
          socket={this.socket}
          toggleColorSelector={this.toggleColorSelector.bind(this)}
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
