/**
 * @Zheng 
 * @flow reusable styles
 */

import { Dimensions } from "react-native"

const { width, height } = Dimensions.get("window")

// please use  Metrics.base styles
const metrics = {
  smallMargin: 10,
  baseMargin: 20,
  socialMargin: 30,
  doubleBaseMargin: 40,
  smallPadding: 10,
  padding: 20,
  buttonRadius: 5,
  doubleButtonRadius: 10,
  baseBorderRadius: 10,
  doubleBorderRadius: 20,
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,

  icons: {
    tiny: 15,
    small: 20,
    medium: 30,
    large: 45,
    xl: 60
  },
  images: {
    small: 20,
    medium: 40,
    large: 60,
    logo: 300
  }
};

export default metrics
