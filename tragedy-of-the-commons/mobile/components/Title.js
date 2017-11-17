import React from 'react';
import { View, Text } from 'react-native';

export default class Title extends React.Component {

  render() {
    const { text, style } = this.props;
    return (
      <View
        style={[style, {
          height: 30,
          paddingLeft: 5,
          paddingRight: 5,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
          shadowRadius: 2,
          shadowColor: 'black',
          shadowOpacity: 1,
          shadowOffset: { width: 0, height: 0 }
        }]}
      >
        <Text style={{ color: 'black' }}>{text}</Text>
      </View>
    );
  }
}
