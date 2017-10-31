import React from 'react';
import io from 'socket.io-client';
import hardin from './hardin.png';
import './App.css';
import PixelCanvas from './PixelCanvas';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { pixelMatrix: [] };
    this.socket = io();
    this.socket.on('pixelMatrix', pixelMatrix => this.setState(() => ({ pixelMatrix })));
  }

  renderPixelCanvas() {
    const rows = this.state.pixelMatrix.length;
    const cols = this.state.pixelMatrix[0].length;
    return (
      <div className="PixelCanvas-container">
        <PixelCanvas
          className="PixelCanvas"
          rows={rows}
          cols={cols}
          socket={this.socket}
          pixelMatrix={this.state.pixelMatrix}
        />
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

  renderTragedy(contents) {
    return (
      <div className="App">
        <header className="App-header">
          <img src={hardin} className="App-logo" alt="logo" />
          <h1 className="App-title">TRAGEDY OF THE COMMONS</h1>
        </header>
        {contents}
      </div>
    );
  }

  render() {
    const contents = this.state.pixelMatrix.length > 0 ? this.renderPixelCanvas() : this.renderLoader();
    return this.renderTragedy(contents);
  }
}
