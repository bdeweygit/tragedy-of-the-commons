import React from 'react';
import { TouchableOpacity, Image } from 'react-native';

export default class ImageButton extends React.Component {

  render() {
    const { source, onPress, style } = this.props;
    return (
      <TouchableOpacity style={style} onPress={onPress}>
        <Image
          resizeMode={'contain'} 
          style={{ width: style.width, height: style.height }}
          source={source}
        />
      </TouchableOpacity>
    );
  }
}
