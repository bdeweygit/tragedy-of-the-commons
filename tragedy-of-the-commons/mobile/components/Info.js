import React from 'react';
import { View, Text, Dimensions } from 'react-native';

export default class Info extends React.Component {

  render() {
    return (
      <View
        style={{
          position: 'absolute',
          width: 400,
          height: 100,
          left: (Dimensions.get('window').width / 2) - 200,
          top: (Dimensions.get('window').height / 6),
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
          shadowRadius: 2,
          shadowColor: 'black',
          shadowOpacity: 1,
          shadowOffset: { width: 0, height: 0 }
        }}
      >
        <Text style={{ margin: 20, fontSize: 14, textAlign: 'center' }}>
          {
            'Select a color and tap on the canvas to add a pixel.\n' +
            'You can zoom in and out to get a better look.'
          }
        </Text>
      </View>
    );
  }
}
