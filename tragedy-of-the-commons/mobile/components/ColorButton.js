import React from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';

export default class ColorButton extends React.Component {

  render() {
    const { style, onPress, selectedColor } = this.props;
    return (
      <TouchableWithoutFeedback
        style={{ flex: 1 }}
        onPress={onPress}
      >
        <View
          style={[style, { opacity: style.backgroundColor === selectedColor ? 1 : 0.2 }]}
        />
      </TouchableWithoutFeedback>
    );
  }
}
