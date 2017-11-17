import React from 'react';
import { View, Text, TextInput, Dimensions } from 'react-native';
import BlackButton from './BlackButton';

export default class JoinForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = { title: null, password: null, formColor: 'white', showPasswordInput: false };
  }

  onPress() {
    const title = this.state.title;
    const password = this.state.password;

    if (!title || (this.state.showPasswordInput && !password)) {
      this.complain();
    } else {
      this.props.socket.emit('join', { title, password }, ({ canvas, error }) => {
        if (canvas) {
          this.props.onCanvas(canvas);
        } else if (error.password) {
          if (this.state.showPasswordInput) {
            this.complain();
          } else {
            this.showPasswordInput();
          }
        } else {
          this.complain();
        }
      });
    }
  }

  showPasswordInput() {
    this.setState(ps => ({ ...ps, showPasswordInput: true }));
  }

  complain() {
    this.setState(prevState => {
      setTimeout(() => this.setState(ps => ({ ...ps, formColor: 'white' })), 500);
      return { ...prevState, formColor: 'red' };
    });
  }

  renderTitleInput() {
    return (
      <TextInput
        style={{
          width: 300,
          height: 30,
          backgroundColor: '#e6e6e6',
          borderColor: 'black',
          borderWidth: 2,
          padding: 1,
          textAlign: 'center'
        }}
        onChangeText={title => this.setState(ps => ({ ...ps, title }))}
        value={this.state.title}
        placeholder={'Title'}
      />
    );
  }

  renderPasswordInput() {
    return (
      <TextInput
        style={{
          width: 300,
          height: 30,
          backgroundColor: '#e6e6e6',
          borderColor: 'black',
          borderWidth: 2,
          padding: 1,
          textAlign: 'center'
        }}
        onChangeText={password => this.setState(ps => ({ ...ps, password }))}
        value={this.state.password}
        secureTextEntry
        placeholder={'Password'}
      />
    );
  }

  renderInput() {
    return this.state.showPasswordInput ?
      this.renderPasswordInput() : this.renderTitleInput();
  }

  renderButton() {
    const text = this.state.showPasswordInput ? 'Join Private Canvas' : 'Join';
    return (
      <BlackButton
        style={{ width: 200, height: 30, margin: 0 }}
        onPress={this.onPress.bind(this)}
      >
        <Text style={{ color: 'white' }}>{text}</Text>
      </BlackButton>
    );
  }

  render() {
    return (
      <View
        style={{
          position: 'absolute',
          width: 400,
          height: 100,
          left: (Dimensions.get('window').width / 2) - 200,
          top: (Dimensions.get('window').height / 2) - 50,
          backgroundColor: this.state.formColor,
          flexDirection: 'column',
          justifyContent: 'space-around',
          alignItems: 'center',
          shadowRadius: 2,
          shadowColor: 'black',
          shadowOpacity: 1,
          shadowOffset: { width: 0, height: 0 }
        }}
      >
        {this.renderInput()}
        {this.renderButton()}
      </View>
    );
  }
}
