import React from 'react';
import TextInput from './TextInput';
import BlackButton from './BlackButton';

export default class FindCanvasForm extends React.Component {
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
    const title = this.form.elements.title.value;
    this.props.socket.emit('findCanvas', title, slug => {
      if (slug) {
        window.location.replace(`${window.location.origin}/${slug}`)
      } else {
        this.complain();
      }
    });
  }

  render() {
    const { className, inputWidth, inputHeight, onClose } = this.props;
    const backgroundColor = this.state.formColor;
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
          <TextInput label={'Title'} name={'title'}
            style={{
              width: inputWidth,
              height: inputHeight
            }}
          />
          <BlackButton onClick={this.onClick.bind(this)} text={'Find'} width={200} height={40} />
        </form>
      </div>
    );
  }
}
