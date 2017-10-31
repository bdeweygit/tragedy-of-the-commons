import React from 'react';
import { View } from 'react-native';

export default class ColorSelector extends React.Component {
  render() {
    return (
      <View
        style={{
          backgroundColor: 'aqua',
          width: 50,
          height: 50,
          position: 'absolute'
        }}
      />
    );
  }
}
