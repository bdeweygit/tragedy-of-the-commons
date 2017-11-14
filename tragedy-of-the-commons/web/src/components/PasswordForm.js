import React from 'react';
import TextInput from './TextInput';
import BlackButton from './BlackButton';

export default class PasswordForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { formColor: 'white' };
  }

  complain() {
    this.setState(prevState => {
      setTimeout(() => this.setState(prevState => ({ ...prevState, formColor: 'white' })), 500);
      return { ...prevState, formColor: 'red' }
    })
  }

  onClick() {
    const password = this.form.elements[0].value;
    this.props.socket.emit('accessPrivateCanvas', password, canvas => {
      if (canvas) {
        this.props.onAccessPrivateCanvas(canvas);
      } else {
        this.complain();
      }
    });
  }

  render() {
    const { className, inputWidth, inputHeight, opacity } = this.props;
    const backgroundColor = this.state.formColor;
    return (
      <div style={{
        display: 'flex',
        position: 'absolute',
        width: '100%',
        marginTop: 100,
        justifyContent: 'center',
        alignItems: 'center',
        opacity
      }}>
        <form ref={ref => this.form = ref} className={className} style={{ backgroundColor }}>
          <TextInput label={'Password'} name={'password'} type={'password'}
            style={{
              width: inputWidth,
              height: inputHeight
            }}
          />
          <BlackButton onClick={this.onClick.bind(this)} text={'Access'} />
        </form>
      </div>
    );
  }
}
