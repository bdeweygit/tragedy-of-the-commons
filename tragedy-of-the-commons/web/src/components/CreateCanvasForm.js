import React from 'react';
import TextInput from './TextInput';

export default class CreateCanvasForm extends React.Component {
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

  onClick(onSubmit) {
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

  render() {
    const { className, inputWidth, inputHeight, opacity, onSubmit } = this.props;
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
          <button onClick={this.onClick.bind(this, onSubmit)} type={'button'}>Create</button>
        </form>
      </div>
    );
  }
}
