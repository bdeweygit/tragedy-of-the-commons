import React from 'react';
import io from 'socket.io-client';
import hardin from './hardin.png';
import './App.css';
import PixelCanvas from './components/PixelCanvas';
import NewCanvasForm from './components/NewCanvasForm';
import JoinCanvasForm from './components/JoinCanvasForm';
import BlackButton from './components/BlackButton';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      canvas: null,
      showLoader: true,
      showNewCanvasForm: false,
      showJoinCanvasForm: false
    };

    this.socket = io();
    this.socket.on('canvas', ({ canvas }) => this.setCanvas(canvas));
  }

  setCanvas(canvas) {
    this.setState(prevState => ({
      ...prevState,
      canvas,
      showNewCanvasForm: false,
      showJoinCanvasForm: false,
      showLoader: false
    }));
  }

  joinDefaultCanvas() {
    const query = { title: 'TRAGEDY OF THE COMMONS' };
    this.socket.emit('join', query, ({ canvas }) => this.setCanvas(canvas));
  }

  showLoader(valid) {
    this.setState(prevState => ({
      ...prevState,
      showLoader: true
    }));
  }

  showNewCanvasForm() {
    this.setState(prevState => ({
      ...prevState,
      showNewCanvasForm: true,
      showJoinCanvasForm: false,
      showLoader: false
    }));
  }

  showJoinCanvasForm() {
    this.setState(prevState => ({
      ...prevState,
      showJoinCanvasForm: true,
      showNewCanvasForm: false,
      showLoader: false
    }));
  }

  renderNewCanvasForm() {
    return (
      <NewCanvasForm
        socket={this.socket}
        className={'Form'}
        inputWidth={'100%'}
        inputHeight={50}
        onCreate={this.showLoader.bind(this)}
        onClose={() => this.setState(ps => ({ ...ps, showNewCanvasForm: false}))}
      />
    )
  }

  renderJoinCanvasForm() {
    return (
      <JoinCanvasForm
        socket={this.socket}
        className={'Form'}
        inputWidth={'100%'}
        inputHeight={50}
        onCanvas={this.setCanvas.bind(this)}
        onClose={() => this.setState(ps => ({ ...ps, showJoinCanvasForm: false}))}
      />
    )
  }

  renderFormOrNull() {
    return this.state.showNewCanvasForm ? (
      this.renderNewCanvasForm()
    ) : this.state.showJoinCanvasForm ? (
      this.renderJoinCanvasForm()
    ) : null;
  }

  renderPixelCanvasOrNull() {
    const rows = this.state.canvas.rows;
    const cols = this.state.canvas.cols;
    return this.state.showLoader ? null : (
      <PixelCanvas
        className="PixelCanvas"
        rows={rows}
        cols={cols}
        socket={this.socket}
        canvas={this.state.canvas}
      />
    );
  }

  renderMainContent() {
    return (
      <div className="PixelCanvas-container">
        {this.renderPixelCanvasOrNull()}
        {this.renderFormOrNull()}
        {this.state.showLoader ? <div style={{ position: 'absolute' }} className="Loader" /> : null}
      </div>
    );
  }

  renderLoader() {
    return (
      <div className="PixelCanvas-container">
        <div className="Loader" />
      </div>
    );
  }

  renderButtons() {
    return (
      this.state.showLoader ? null : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <BlackButton
            width={200}
            height={40}
            text={'New Canvas'} onClick={this.showNewCanvasForm.bind(this)}
          />
          <BlackButton
            width={200}
            height={40}
            text={'Join Canvas'} onClick={this.showJoinCanvasForm.bind(this)}
          />
        </div>
      )
    );
  }

  renderQR() {
    return (
      this.state.showLoader ? null : (
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'black', height: 100, width: 100 }} />
        </div>
      )
    );
  }

  renderHeaderOrNull() {
    const { canvas } = this.state;
    const title = canvas ? canvas.title : 'TRAGEDY OF THE COMMONS';
    return this.state.showLoader ? null : (
      <header className="App-header">
        {this.renderQR()}
        <div style={{ flex: 1 }}>
          <input type="image"
            src={hardin}
            className="App-logo"
            alt={'logo'}
            onClick={this.joinDefaultCanvas.bind(this)}
          />
          <h1 className="App-title">{title}</h1>
        </div>
        {this.renderButtons()}
      </header>
    );
  }

  renderApp(contents) {
    return (
      <div className="App">
        {this.renderHeaderOrNull()}
        {contents}
      </div>
    );
  }

  render() {
    const contents = this.state.showLoader ? this.renderLoader() : this.renderMainContent();
    return this.renderApp(contents);
  }
}
