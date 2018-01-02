import React from 'react';
import { TouchableOpacity } from 'react-native';

export default class BlackButton extends React.Component {

  render() {
    const { style, onPress, children } = this.props;
    return (
      <TouchableOpacity
        style={[
            {
              backgroundColor: 'black',
              justifyContent: 'center',
              alignItems: 'center'
            },
            style
        ]}
        onPress={onPress}
      >
        {children}
      </TouchableOpacity>
    );
  }
}
