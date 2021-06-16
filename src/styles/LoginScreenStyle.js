import { StyleSheet } from "react-native"
import {
  Colors,
  Metrics,
  Fonts
} from "../themes/"

export default StyleSheet.create({
  loginView : {
    flex: 1,
    backgroundColor: Colors.brightblue
  },
  logoImageView: {
    alignItems: 'center',
    marginTop: Metrics.doubleBaseMargin,
    marginBottom: Metrics.baseMargin
  },
  logoImage: {
    width: 120,
    height: 120,
    borderRadius: Metrics.doubleBorderRadius
  },
  textInput: {
    height: 50,
    backgroundColor: Colors.white,
    marginLeft: Metrics.doubleBaseMargin,
    marginRight: Metrics.doubleBaseMargin,
    marginTop: Metrics.baseMargin,
    paddingLeft: Metrics.smallPadding,
    borderRadius: Metrics.baseBorderRadius
  },
  invalidText: {
    alignItems: 'flex-end',
    marginRight: Metrics.doubleBaseMargin,
    marginTop: 5
  },
  forgotPs: {
    color: Colors.brightdark,
    marginTop: Metrics.socialMargin,
    marginBottom: Metrics.baseMargin,
    marginRight: Metrics.doubleBaseMargin
  },
  signInView: {
    height: 40,
    marginLeft: Metrics.doubleBaseMargin,
    marginRight: Metrics.doubleBaseMargin,
    marginBottom: Metrics.baseMargin,
    backgroundColor: Colors.blue,
    borderRadius: Metrics.doubleBorderRadius,
    justifyContent: 'center',
    alignItems: 'center'
  },
  signInUp: {
    color: Colors.white,
    fontSize: Fonts.size.medium,
    fontWeight: '600'
  },
  signUpView: {
    height: 40,
    marginLeft: Metrics.doubleBaseMargin,
    marginRight: Metrics.doubleBaseMargin,
    backgroundColor: Colors.blue,
    borderRadius: Metrics.doubleBorderRadius,
    justifyContent: 'center',
    alignItems: 'center'
  },
  or: {
    color: Colors.brightdark,
    marginTop: Metrics.baseMargin,
    marginLeft: Metrics.doubleBaseMargin,
    marginRight: Metrics.doubleBaseMargin
  },
  socialLogin: {
    flexDirection: 'row',
    marginTop: Metrics.baseMargin,
    marginLeft: 50
  },
  googleView: {
    marginLeft: Metrics.socialMargin,
    marginTop: 3
  },
  facebookView: {
    marginLeft: Metrics.socialMargin
  },
  twitterView: {
    marginLeft: Metrics.doubleBaseMargin,
    marginTop: 3
  },
  socialIcon: {
    width: 50,
    height: 50
  },
  facebook: {
    height: 55,
    width: 55
  }
})