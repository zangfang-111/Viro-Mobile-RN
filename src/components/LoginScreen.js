import React, { Component } from 'react'

import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import images from '../themes/Images'
import OAuthManager from 'react-native-oauth'
import styles from '../styles/LoginScreenStyle'
import { Actions as NavigationActions } from "react-native-router-flux"

const manager = new OAuthManager('ViroARkitsDavid')

class LoginScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      invalidStatus: false
    }
  }
  
  componentDidMount() {
    manager.configure({
      google: {
        callback_url: `com.googleusercontent.apps.569240379160-v9qdf7c1378qggo6ou343h1q329bhb83:/google`,
        client_id: '569240379160-v9qdf7c1378qggo6ou343h1q329bhb83.apps.googleusercontent.com',
      },
      facebook: {
        client_id: '1121562028010421',
        client_secret: 'db6bef3d29f3ff5fccfbe58ba1d2852b'
      }
    })
  }

  _googleLogin = () => {
    manager.authorize('google', { scopes: 'email+profile' })
      .then(resp => {
          NavigationActions.ViroScreen({ data: resp })
        })
      .catch(err => console.log('There was an error'))
  }

  _facebookLogin = () => {
    manager.authorize('facebook')
      .then(resp => {
          NavigationActions.ViroScreen({ data: resp })
        })
      .catch(err => console.log('There was an error'))
  }

  _twitterLogin = () => {
    manager.authorize('twitter')
      .then(resp => {
          NavigationActions.ViroScreen({ data: resp })
        })
      .catch(err => console.log('There was an error'))
  }

  _login = () => {
    const { email, password } = this.state
    if (email == '' || password == '') {
      this.setState({ invalidStatus: true })
    } else {
      this.setState({ invalidStatus: false })
      let data = { email, password }
      NavigationActions.ViroApp({ data })  
    }
  }

  render() {
    const { email, password, invalidStatus } = this.state

    return (
      <View style={styles.loginView}>
        <View style={styles.logoImageView}>
          <Image source={images.logo} style={styles.logoImage} />
        </View>
        <View>
          <TextInput 
            style={styles.textInput}
            name='email'
            value={email}
            placeholder='Please enter your email'
            onChange={(e) => this.setState({ email: e.target.value})}
          />
          { invalidStatus &&
            <View style={styles.invalidText}>
              <Text style={{ color: 'red' }}>Invalid Email</Text>
            </View>
          }
          <TextInput
            style={styles.textInput}
            secureTextEntry={true}
            value={password}
            placeholder='Please enter your password'
            onChange={(e) => this.setState({ password: e.target.value})}
          />
          { invalidStatus &&
            <View style={styles.invalidText}>
              <Text style={{ color: 'red' }}>Invalid password</Text>
            </View>
          }
        </View>
        <View>
          <TouchableOpacity>
            <View style={{ alignItems: 'flex-end'}}>
              <Text style={styles.forgotPs}>Forgot password?</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signInView}
            onPress={this._login}
          >
            <Text style={styles.signInUp}>SIGN IN</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signUpView}>
            <Text style={styles.signInUp}>SIGN UP</Text>
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.or}>______ OR ______</Text>
        </View>
        <View style={styles.socialLogin}>
          <TouchableOpacity
            style={styles.googleView}
            onPress={this._googleLogin}
          >
            <Image source={images.google} style={styles.socialIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.facebookView}
            onPress={this._facebookLogin}
          >
            <Image source={images.facebook} style={styles.facebook} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.twitterView}
            // onPress={this._twitterLogin}
          >
            <Image source={images.twitter} style={styles.socialIcon} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export default LoginScreen