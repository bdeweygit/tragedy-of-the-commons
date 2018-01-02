import React from 'react';

export default class TextInput extends React.Component {

  render() {
    const { name, placeholder, style, type, value, onChange } = this.props;
    return (
      <input type={ type ? type : 'text' }
        name={name}
        onChange={onChange}
        value={value}
        style={style}
        placeholder={placeholder}
      />
    );
  }
}
