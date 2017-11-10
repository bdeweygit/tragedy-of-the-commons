import React from 'react';
import io from 'socket.io-client';
import hardin from './hardin.png';
import './App.css';
import PixelCanvas from './components/PixelCanvas';
import CreateCanvasForm from './components/CreateCanvasForm';
import BlackButton from './components/BlackButton';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { canvas: {}, showLoader: true, showCreateCanvasForm: false };
    console.log('PATHNAME', window.location.pathname);
    this.socket = io(window.location.pathname);
    this.socket.on('canvas', canvas => this.setState((prevState) => ({ ...prevState, canvas, showLoader: false })));
  }

  showLoader() {
    this.setState((prevState) => ({ ...prevState, showLoader: true }));
  }

  showCreateCanvasForm() {
    this.setState((prevState) => ({ ...prevState, showCreateCanvasForm: true }));
  }

  renderCreateCanvasForm() {
    return this.state.showCreateCanvasForm ? (
      <CreateCanvasForm
        className={'Form'}
        action={'/create'}
        inputWidth={'100%'}
        inputHeight={50}
        onSubmit={this.showLoader.bind(this)}
        opacity={this.state.showLoader ? 0 : 1}
      />
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
        {this.renderCreateCanvasForm()}
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

  renderTragedy(contents) {
    return (
      <div className="App">
        <header className="App-header">
          <img src={hardin} className="App-logo" alt="logo" />
          <h1 className="App-title">TRAGEDY OF THE COMMONS</h1>
          {
            this.state.showLoader ? null : (
              <BlackButton
                width={200}
                height={40}
                text={'New Canvas'} onClick={this.showCreateCanvasForm.bind(this)}
              />
            )
          }
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
