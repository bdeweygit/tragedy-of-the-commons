import React from 'react';
import TextInput from './TextInput';
import BlackButton from './BlackButton';

export default class JoinCanvasForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { formColor: 'white', title: null, value: '' };
  }

  complain() {
    this.setState(prevState => {
      setTimeout(() => this.setState(prevState => ({ ...prevState, formColor: 'white' })), 500);
      return { ...prevState, formColor: 'red' }
    })
  }

  onClickButton() {
    const title = this.state.title ? this.state.title : this.form.elements.title.value ;
    const password = this.form.elements.password ? this.form.elements.password.value : null;

    if (title === '' || password === '') {
      this.complain();
    } else {
      this.props.socket.emit('join', { title, password }, ({ canvas, error }) => {
        if (canvas) {
          this.props.onCanvas(canvas);
        } else if (error.password) {
          if (this.state.title) {
            this.complain();
          } else {
            this.setState(ps => ({ ...ps, title, value: '' }))
          }
        } else {
          this.complain();
        }
      });
    }
  }

  handleChange(event) {
    const value =  event.target.value;
    this.setState(ps => ({ ...ps, value }));
  }

  renderPasswordInput(inputWidth, inputHeight) {
    return (
      <TextInput
        label={'Password'}
        name={'password'}
        type={'password'}
        value={this.state.value}
        onChange={this.handleChange.bind(this)}
        style={{
          width: inputWidth,
          height: inputHeight
        }}
      />
    );
  }

  renderTitleInput(inputWidth, inputHeight) {
    return (
      <TextInput
        label={'Title'}
        name={'title'}
        value={this.state.value}
        onChange={this.handleChange.bind(this)}
        style={{
          width: inputWidth,
          height: inputHeight
        }}
      />
    );
  }

  renderInput(inputWidth, inputHeight) {
    return this.state.title ? this.renderPasswordInput(inputWidth, inputHeight) :
      this.renderTitleInput(inputWidth, inputHeight);
  }

  render() {
    const { className, inputWidth, inputHeight, onClose } = this.props;
    const backgroundColor = this.state.formColor;
    const buttonText = this.state.title ? 'Join Private Canvas' : 'Join';
    return (
      <div style={{
        display: 'flex',
        position: 'absolute',
        width: '100%',
        marginTop: 100,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <form ref={ref => this.form = ref} className={className} style={{ backgroundColor }}>
          <BlackButton onClick={onClose} text={'Close'} />
          {this.renderInput(inputWidth, inputHeight)}
          <BlackButton onClick={this.onClickButton.bind(this)} text={buttonText} width={200} height={40} />
        </form>
      </div>
    );
  }
}
