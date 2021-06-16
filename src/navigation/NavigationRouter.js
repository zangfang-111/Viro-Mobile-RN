import React from "react"
import {
  Actions,
  Router,
  Scene,
  Stack 
} from "react-native-router-flux"
import ViroApp from '../components/ViroApp'
import LoginScreen from '../components/LoginScreen'

window.Actions = Actions;

class NavigationRouter extends React.PureComponent {
  render() {
    return (
      <Router getSceneStyle={getSceneStyle} >
        <Stack key="root" >
          <Scene
            initial
            hideNavBar
            hideTabBar
            key="LoginScreen"
            component={ LoginScreen }
          />
          <Scene
            hideNavBar
            hideTabBar
            key="ViroApp"
            component={ ViroApp }
          />
        </Stack>
      </Router>
    );
  }
}

const getSceneStyle = () => ({
  backgroundColor: "white",
  elevation: 0,
  shadowOpacity: 0,
  borderBottomWidth: 0
});

export default NavigationRouter;
