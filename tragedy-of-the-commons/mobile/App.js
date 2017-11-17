import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { KeepAwake } from 'expo';
import io from 'socket.io-client';
import PixelCanvasScrollView from './components/PixelCanvasScrollView';
import BlackButton from './components/BlackButton';
import Title from './components/Title';
import JoinForm from './components/JoinForm';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { canvas: {}, showJoinForm: false };

    this.socket = io('http://localhost:3000');
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

  joinDefaultCanvas() {
    const query = { title: 'TRAGEDY OF THE COMMONS' };
    this.socket.emit('join', query, ({ canvas }) => this.setCanvas(canvas));
  }

  toggleJoinForm() {
    this.setState(ps => ({ ...ps, showJoinForm: !ps.showJoinForm }));
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
    const buttons = [];
    for (let i = 0; i < 10; i++) {
      buttons.push(<BlackButton key={i} style={{ flex: 1, marginTop: 2 }} />);
    }
    return buttons;
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
        <BlackButton
          style={{ width: 30, height: 30, marginRight: 10 }}
          onPress={this.joinDefaultCanvas.bind(this)}
        />
        <BlackButton
          style={{ width: 30, height: 30, marginRight: 10 }}
          onPress={this.toggleJoinForm.bind(this)}
        />
        <Title text={text} style={{ height: 30 }} />
      </View>
    );
  }

  renderTragedy() {
    const canvas = this.state.canvas;
    return (
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
        <PixelCanvasScrollView
          style={{ position: 'absolute' }}
          canvas={canvas}
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
