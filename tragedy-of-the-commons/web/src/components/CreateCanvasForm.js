import React from 'react';
import TextInput from './TextInput';

export default class CreateCanvasForm extends React.Component {

  render() {
    const { className, inputWidth, inputHeight, opacity, action, onSubmit } = this.props;
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
        <form method={'post'} action={action} className={className}>
          <TextInput label={'Title'} name={'title'}
            style={{
              width: inputWidth,
              height: inputHeight
            }}
          />
          <button onClick={onSubmit} type={'submit'}>Create Canvas</button>
        </form>
      </div>
    );
  }
}
