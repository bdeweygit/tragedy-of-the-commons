import React from 'react';
import { View, Text, ActivityIndicator, StatusBar, Platform } from 'react-native';
import { KeepAwake } from 'expo';
import io from 'socket.io-client';
import globe from './assets/globe.png';
import search from './assets/search.png';
import info from './assets/info.png';
import PixelCanvasScrollView from './components/PixelCanvasScrollView';
import ImageButton from './components/ImageButton';
import ColorButton from './components/ColorButton';
import Title from './components/Title';
import Info from './components/Info';
import JoinForm from './components/JoinForm';

const pixelColors = [
  '#222222',
  '#ffffff',
  '#e4e4e4',
  '#888888',
  '#ffa7d1',
  '#e50000',
  '#e59500',
  '#a06a42',
  '#e5d900',
  '#94e044',
  '#02be01',
  '#00d3dd',
  '#0083c7',
  '#0000ea',
  '#cf6ee4',
  '#820080'
];

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { canvas: {}, showJoinForm: false, showInfo: false, color: '#222222' };

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
    this.setState(ps => ({ ...ps, showInfo: false, showJoinForm: !ps.showJoinForm }));
  }

  toggleInfo() {
    this.setState(ps => ({ ...ps, showJoinForm: false, showInfo: !ps.showInfo }));
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

  renderColorButtons(colors) {
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

  renderInfoOrNull() {
    return this.state.showInfo ? (
      <Info />
    ) : null;
  }

  renderColorBar(colors) {
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
        {this.renderColorButtons(colors)}
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
        <ImageButton
          style={{ width: 30, height: 30, marginRight: 10 }}
          onPress={this.toggleInfo.bind(this)}
          source={info}
        />
        <Title text={text} style={{ height: 30 }} />
      </View>
    );
  }

  renderPixelCanvasScrollView() {
    const { canvas, color } = this.state;

    return (
      <PixelCanvasScrollView
        style={{ position: 'absolute' }}
        canvas={canvas}
        color={color}
        socket={this.socket}
      />
    );
  }

  renderTragedy() {
    return (
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
        <StatusBar hidden />
        {this.renderPixelCanvasScrollView()}
        {this.renderTopBar()}
        <View style={{ flexDirection: 'row' }}>
          {this.renderColorBar(pixelColors.slice(0, 8))}
          {this.renderColorBar(pixelColors.slice(8, 16))}
        </View>
        {this.renderJoinFormOrNull()}
        {this.renderInfoOrNull()}
        <KeepAwake />
      </View>
    );
  }

  renderIos() {
    return Object.keys(this.state.canvas).length > 0 ?
      this.renderTragedy() : this.renderLoader();
  }

  renderAndroid() {
    return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text>
        {"Sadly, this experience does not work well on Android. If you don't have an iOS device you can still view the experience in an Appetize.io virtual iOS device. To try it out please visit the link below in your desktop web browser and select the iOS preview at the bottom."}
      </Text>
      <Text>
        {'\nhttps://snack.expo.io/@benjamin-dewey/tragedy-of-the-commons'}
      </Text>
    </View>
    );
  }

  render() {
    return Platform.OS === 'ios' ? this.renderIos() : this.renderAndroid();
  }
}
