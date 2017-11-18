import React from 'react';
import { View, ActivityIndicator, StatusBar } from 'react-native';
import { KeepAwake } from 'expo';
import io from 'socket.io-client';
import globe from './globe.png';
import search from './search.png';
import PixelCanvasScrollView from './components/PixelCanvasScrollView';
import ImageButton from './components/ImageButton';
import ColorButton from './components/ColorButton';
import Title from './components/Title';
import JoinForm from './components/JoinForm';

const colors = [
  'black',
  'white',
  'red',
  'green',
  'blue',
  'yellow',
  'purple',
  'orange',
  '#8B4513' // saddlebrown
];

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { canvas: {}, showJoinForm: false, color: 'black' };

    this.socket = io('http://linserv2.cims.nyu.edu:11601');
    this.socket.on('canvas', ({ canvas }) => {
      this.setState(prevState => ({ ...prevState, canvas }));
    });
  }

  setCanvas(canvas) {
    this.setState(prevState => ({
      ...prevState,
      canvas,
      showJoinForm: false
    }));
  }

  setSelectedColor(color) {
    this.setState(ps => ({ ...ps, color }));
  }

  toggleJoinForm() {
    this.setState(ps => ({ ...ps, showJoinForm: !ps.showJoinForm }));
  }

  joinDefaultCanvas() {
    const query = { title: 'TRAGEDY OF THE COMMONS' };
    this.socket.emit('join', query, ({ canvas }) => this.setCanvas(canvas));
  }

  renderLoader() {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <ActivityIndicator color={'black'} size={'large'} />
        <KeepAwake />
      </View>
    );
  }

  renderColorButtons() {
    return colors.reduce((arr, color, index) => [
      ...arr,
      <ColorButton
        key={index}
        style={{
            flex: 1,
            marginTop: 2,
            backgroundColor: color,
            shadowRadius: 1,
            shadowColor: 'black',
            shadowOpacity: 1,
            shadowOffset: { width: 0, height: 0 }
        }}
        selectedColor={this.state.color}
        onPress={this.setSelectedColor.bind(this, color)}
      />
    ], []);
  }

  renderJoinFormOrNull() {
    return this.state.showJoinForm ? (
      <JoinForm onCanvas={this.setCanvas.bind(this)} socket={this.socket} />
    ) : null;
  }

  renderControlBar() {
    return (
      <View
        style={{
          width: 50,
          paddingBottom: 2,
          paddingRight: 2,
          paddingLeft: 2,
          height: '100%',
          justifyContent: 'center',
          alignItems: 'stretch',
          flexDirection: 'column'
        }}
      >
        {this.renderColorButtons()}
      </View>
    );
  }

  renderTopBar() {
    const text = this.state.canvas.title;
    return (
      <View style={{ flexDirection: 'row', height: 30, margin: 10 }}>
        <ImageButton
          style={{ width: 30, height: 30, marginRight: 10 }}
          onPress={this.joinDefaultCanvas.bind(this)}
          source={globe}
        />
        <ImageButton
          style={{ width: 30, height: 30, marginRight: 10 }}
          onPress={this.toggleJoinForm.bind(this)}
          source={search}
        />
        <Title text={text} style={{ height: 30 }} />
      </View>
    );
  }

  renderTragedy() {
    const { canvas, color } = this.state;
    return (
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
        <StatusBar hidden />
        <PixelCanvasScrollView
          style={{ position: 'absolute' }}
          canvas={canvas}
          color={color}
          socket={this.socket}
        />
        {this.renderTopBar()}
        {this.renderControlBar()}
        {this.renderJoinFormOrNull()}
        <KeepAwake />
      </View>
    );
  }

  render() {
    return Object.keys(this.state.canvas).length > 0 ?
      this.renderTragedy() : this.renderLoader();
  }
}
