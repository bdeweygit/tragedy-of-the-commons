import React from 'react';

export default class BlackButton extends React.Component {

  render() {
    const { onClick, text, width, height } = this.props;
    return (
      <div>
        <button onClick={onClick} type={'button'} style={{
            color: 'white',
            backgroundColor: 'black',
            width,
            height
          }}
        >
          {text}
        </button>
      </div>
    );
  }
}
