import React from 'react';

export default class TextInput extends React.Component {

  render() {
    const { label, name , style, type, value, onChange } = this.props;
    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <label style={{ marginRight: 10 }}>{label}</label>
        <input type={ type ? type : 'text' }
          name={name}
          onChange={onChange}
          value={value}
          style={style}
        />
      </div>
    );
  }
}
