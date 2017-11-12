import React from 'react';
import TextInput from './TextInput';

export default class CreateCanvasForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { formColor: 'white', showPasswordInput: false };
  }

  complain() {
    this.setState(prevState => {
      setTimeout(() => this.setState(prevState => ({ ...prevState, formColor: 'white' })), 500);
      return { ...prevState, formColor: 'red' }
    })
  }

  onClickButton(onSubmit) {
    const title = this.form.elements[0].value;

    this.props.socket.emit('validateNewTitle', title, valid => {
      if (valid) {
        this.form.submit();
        onSubmit();
      } else {
        this.complain();
      }
    });
  }

  onClickPublicRadio() {
    this.setState(prevState => ({ ...prevState, showPasswordInput: false }))
  }

  onClickPrivateRadio() {
    this.setState(prevState => ({ ...prevState, showPasswordInput: true }))
  }

  renderPasswordInputOrNull() {
    const { inputWidth, inputHeight } = this.props;
    return this.state.showPasswordInput ? (
      <TextInput type={'password'} label={'Password'} name={'password'}
        style={{
          width: inputWidth,
          height: inputHeight
        }}
      />
    ) : null;
  }

  render() {
    const { className, inputWidth, inputHeight, opacity, onSubmit } = this.props;
    const showPasswordInput = this.state.showPasswordInput;
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
        <form ref={ref => this.form = ref} method={'post'} className={className} style={{ backgroundColor }}>
          <TextInput label={'Title'} name={'title'}
            style={{
              width: inputWidth,
              height: inputHeight
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            <label>Public</label>
            <input
              checked={!showPasswordInput}
              type="radio" name="access"
              value="public"
              onClick={this.onClickPublicRadio.bind(this)}
            />
            <label>Private</label>
            <input
              checked={showPasswordInput}
              type="radio"
              name="access"
              value="private"
              onClick={this.onClickPrivateRadio.bind(this)}
            />
          </div>
          {this.renderPasswordInputOrNull()}
          <button onClick={this.onClickButton.bind(this, onSubmit)} type={'button'}>Create</button>
        </form>
      </div>
    );
  }
}
