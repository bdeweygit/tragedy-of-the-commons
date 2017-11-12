import React from 'react';
import io from 'socket.io-client';
import hardin from './hardin.png';
import './App.css';
import PixelCanvas from './components/PixelCanvas';
import CreateCanvasForm from './components/CreateCanvasForm';
import FindCanvasForm from './components/FindCanvasForm';
import BlackButton from './components/BlackButton';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      canvas: {},
      showLoader: true,
      showCreateCanvasForm: false,
      showFindCanvasForm: false
    };
    this.socket = io(window.location.pathname);
    this.socket.on('canvas', canvas => this.setState((prevState) => ({ ...prevState, canvas, showLoader: false })));
    // socket.on 'private' show a password input
  }

  showLoader(valid) {
    this.setState((prevState) => ({
      ...prevState,
      showLoader: true,
      showCreateCanvasForm: false,
      showFindCanvasForm: false
    }));
  }

  showCreateCanvasForm() {
    this.setState((prevState) => ({
      ...prevState,
      showCreateCanvasForm: true,
      showFindCanvasForm: false,
      showLoader: false
    }));
  }

  showFindCanvasForm() {
    this.setState((prevState) => ({
      ...prevState,
      showFindCanvasForm: true,
      showCreateCanvasForm: false,
      showLoader: false
    }));
  }

  renderCreateCanvasForm() {
    return (
      <CreateCanvasForm
        socket={this.socket}
        className={'Form'}
        inputWidth={'100%'}
        inputHeight={50}
        onSubmit={this.showLoader.bind(this)}
      />
    )
  }

  renderFindCanvasForm() {
    return (
      <FindCanvasForm
        socket={this.socket}
        className={'Form'}
        inputWidth={'100%'}
        inputHeight={50}
      />
    )
  }

  renderFormOrNull() {
    return this.state.showCreateCanvasForm ? (
      this.renderCreateCanvasForm()
    ) : this.state.showFindCanvasForm ? (
      this.renderFindCanvasForm()
    ) : null;
  }

  renderPixelCanvas() {
    const rows = this.state.canvas.rows;
    const cols = this.state.canvas.cols;
    return (
      <div className="PixelCanvas-container">
        <PixelCanvas
          className="PixelCanvas"
          rows={rows}
          cols={cols}
          socket={this.socket}
          canvas={this.state.canvas}
          opacity={this.state.showLoader ? 0 : 1}
        />
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
            text={'New Canvas'} onClick={this.showCreateCanvasForm.bind(this)}
          />
          <BlackButton
            width={200}
            height={40}
            text={'Find Canvas'} onClick={this.showFindCanvasForm.bind(this)}
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

  renderTragedy(contents) {
    return (
      <div className="App">
        <header className="App-header">
          {this.renderQR()}
          <div style={{ flex: 1 }}>
            <a href={`${window.location.origin}`}>
              <img src={hardin} className="App-logo" alt="logo" />
            </a>
            <h1 className="App-title">TRAGEDY OF THE COMMONS</h1>
          </div>
          {this.renderButtons()}
        </header>
        {contents}
      </div>
    );
  }

  render() {
    const contents = Object.keys(this.state.canvas).length > 0 ? this.renderPixelCanvas() : this.renderLoader();
    return this.renderTragedy(contents);
  }
}
