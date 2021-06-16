import React, { Component } from 'react';
import { connect } from 'react-redux';
import ModelItemRender from './ModelItemRender';
import PortalItemRender from './PortalItemRender';
import EffectItemRender from './EffectItemRender';
import { ARTrackingInitialized } from '../redux/actions';

import {
  ViroARScene,
  ViroConstants,
  ViroMaterials,
  ViroAmbientLight,
  ViroDirectionalLight,
  ViroSpotLight
} from 'react-viro';

export class figment extends Component {

  constructor(props) {
    super(props);

    this.state = {
      text : "not tapped",
      currentObj: 0,
      isLoading: false,
      scaleSurface: [1,1,1],
    }

    this._renderModels = this._renderModels.bind(this);
    this._renderPortals = this._renderPortals.bind(this);
    this._renderEffects = this._renderEffects.bind(this);
    this._onTrackingUpdated = this._onTrackingUpdated.bind(this);
    this._performARHitTest = this._performARHitTest.bind(this);
    this._onLoadCallback = this._onLoadCallback.bind(this);
    this._onModelsClickStateCallback = this._onModelsClickStateCallback.bind(this);
    this._onPortalsClickStateCallback = this._onPortalsClickStateCallback.bind(this);
  }

  render() {
    let startingBitMask = 2;
    let models = this._renderModels(this.props.modelItems, startingBitMask);
    startingBitMask += Object.keys(this.props.modelItems).length;
    let portals = this._renderPortals(this.props.portalItems, startingBitMask);
    let effects = this._renderEffects(this.props.effectItems);

    return (
      <ViroARScene ref="arscene" physicsWorld={{gravity:[0, -9.81, 0]}} postProcessEffects={[this.props.postProcessEffects]}
          onTrackingUpdated={this._onTrackingUpdated}>
        <ViroAmbientLight color="#ffffff" intensity={20}/>
        <ViroDirectionalLight color="#ffffff" direction={[0,-1,-.2]}/>
        <ViroSpotLight
          innerAngle={5}
          outerAngle={90}
          direction={[0,1,0]}
          position={[0, -7, 0]}
          color="#ffffff"
          intensity={250}/>
        {models}
        {portals}
        {effects}
      </ViroARScene>
    )
  }
  _renderModels(modelItems, startingBitMask) {
    var renderedObjects = [];
    if(modelItems) {
      var root = this;
      let objBitMask = startingBitMask;
      Object.keys(modelItems).forEach(function(currentKey) {
        if(modelItems[currentKey] != null && modelItems[currentKey] != undefined) {
          renderedObjects.push(
            <ModelItemRender key={modelItems[currentKey].uuid}
              modelIDProps={modelItems[currentKey]}
              hitTestMethod={root._performARHitTest}
              onLoadCallback={root._onLoadCallback}
              onClickStateCallback={root._onModelsClickStateCallback}
              bitMask={Math.pow(2,objBitMask)} />
          );
        }
        objBitMask++;
      });

    }
    return renderedObjects;
  }
  _renderPortals(portalItems, startingBitMask) {
    var renderedObjects = [];
    if(portalItems) {
      var root = this;
      let portalBitMask = startingBitMask;
      Object.keys(portalItems).forEach(function(currentKey) {
        if(portalItems[currentKey] != null && portalItems[currentKey] != undefined) {
          renderedObjects.push(
            <PortalItemRender
            key={portalItems[currentKey].uuid}
            portalIDProps={portalItems[currentKey]}
            hitTestMethod={root._performARHitTest}
            onLoadCallback={root._onLoadCallback}
            onClickStateCallback={root._onPortalsClickStateCallback}
            bitMask={Math.pow(2,portalBitMask)}/>
          );
        }
        portalBitMask++;
      });
    }
    return renderedObjects;
  }
  _renderEffects(effectItems) {
    if(effectItems){
      for(var i =0; i<effectItems.length; i++) {
        if(effectItems[i].selected) {
          return (<EffectItemRender index={i} effectItem={effectItems[i]} />);
        }
      }
    }
  }
  _onTrackingUpdated(state, reason) {
    var trackingNormal = false;
    if (state == ViroConstants.TRACKING_NORMAL) {
      trackingNormal = true;
    } 
    this.props.dispatchARTrackingInitialized(trackingNormal);
  }
  _performARHitTest(callback) {
    this.refs["arscene"].getCameraOrientationAsync().then((orientation) => {
      this.refs["arscene"].performARHitTestWithRay(orientation.forward).then((results)=>{
        callback(orientation.position, orientation.forward, results);
      })
    });
  }

  _onLoadCallback(uuid, loadState) {
    this.props.arSceneNavigator.viroAppProps.loadingObjectCallback(uuid, loadState);
  }
  _onModelsClickStateCallback(uuid, clickState, itemType) {
    this.props.arSceneNavigator.viroAppProps.clickStateCallback(uuid, clickState, itemType);
  }
  _onPortalsClickStateCallback(index, clickState, itemType) {
    this.props.arSceneNavigator.viroAppProps.clickStateCallback(index, clickState, itemType);
  }
}

ViroMaterials.createMaterials({
  shadowCatcher: {
    writesToDepthBuffer: false,
    readsFromDepthBuffer: false,
    diffuseColor: "#ff9999"

  },
  ground: {
    lightingModel: "Lambert",
    cullMode: "None",
    shininess: 2.0,
    diffuseColor: "#ff999900"
  },
  theatre: {
    diffuseTexture: require('../res/360_dark_theatre.jpg'),
  },
});

// -- REDUX STORE
function selectProps(store) {
  return {
    modelItems: store.arobjects.modelItems,
    portalItems: store.arobjects.portalItems,
    effectItems: store.arobjects.effectItems,
    postProcessEffects: store.arobjects.postProcessEffects,
  };
}

// -- dispatch REDUX ACTIONS map
const mapDispatchToProps = (dispatch) => {
  return {
    dispatchARTrackingInitialized:(trackingNormal) => dispatch(ARTrackingInitialized(trackingNormal)),
  }
}
module.exports = connect(selectProps, mapDispatchToProps)(figment);
