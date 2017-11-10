import React from 'react';

export default class TextInput extends React.Component {

  render() {
    const { label, name , style } = this.props;
    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <label style={{ marginRight: 10 }}>{label}</label>
        <input type='text' name={name}
          style={style}
        />
      </div>
    );
  }
}
