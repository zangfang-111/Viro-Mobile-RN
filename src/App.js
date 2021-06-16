import { createStore } from 'redux'
import { Provider } from 'react-redux'
import reducers from './redux/reducers'
import React, { Component } from 'react'
import { SafeAreaView } from "react-native"
import NavigationRouter from "./navigation/NavigationRouter"

const store = createStore(reducers);

export default class App extends Component {
  render() {
    return (
      <Provider store={ store }>
        <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
          <NavigationRouter/>
        </SafeAreaView>
      </Provider>
    )
  }
}
