/**
 * @Zheng 
 * @flow reusable styles
 */

import Fonts from "./Fonts";
import Metrics from "./Metrics";
import Colors from "./Colors";

/** 
 * This file is for a reusable grouping of Theme items.
 * Similar to an XML fragment layout in Android
 */

const ApplicationStyles = {
  screen: {
    mainContainer: {
      flex: 1,
      backgroundColor: Colors.transparent
    },
    backgroundImage: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }
  },
  /**
   *  for example style: {
        container: {
          flex: 1,
          paddingTop: Metrics.baseMargin
        }
      }
   */
  
};

export default ApplicationStyles;
