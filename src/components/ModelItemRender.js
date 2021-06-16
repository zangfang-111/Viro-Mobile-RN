'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import * as LoadConstants from '../redux/LoadingStateConstants';
import * as UIConstants from '../redux/UIConstants';
import * as ModelData from  '../model/ModelItems';
import TimerMixin from 'react-timer-mixin';
import ParticleEmitter from '../model/emitters/ParticleEmitter';
import renderIf from '../helpers/renderIf';
import {
  ViroMaterials,
  ViroNode,
  Viro3DObject,
  ViroSpotLight,
  ViroQuad,
} from 'react-viro';

var createReactClass = require('create-react-class');

var ModelItemRender = createReactClass({
  mixins: [TimerMixin],
  propTypes: {
    modelIDProps: PropTypes.any,
    onLoadCallback: PropTypes.func,
    onClickStateCallback: PropTypes.func,
    hitTestMethod: PropTypes.func,
  },

  componentDidMount() {
    this._modelData = ModelData.getModelArray();
  },

  getInitialState() {
    return {
      scale : ModelData.getModelArray()[this.props.modelIDProps.index].scale,
      rotation : [0, 0, 0],
      nodeIsVisible : false,
      position: [0, 10, 1], // make it appear initially high in the sky
      shouldBillboard : true,
      runAnimation: true,
      showParticles: true,
      itemClickedDown: false,
    }
  },

  render: function() {
    var modelItem = ModelData.getModelArray()[this.props.modelIDProps.index];
    let transformBehaviors = {};
    if (this.state.shouldBillboard) {
      transformBehaviors.transformBehaviors = this.state.shouldBillboard ? "billboardY" : [];
    }
    return (
      <ViroNode
        {...transformBehaviors}
        key={this.props.modelIDProps.uuid}
        ref={this._setARNodeRef}
        visible={this.state.nodeIsVisible}
        position={this.state.position}
        scale={this.state.scale}
        rotation={this.state.rotation}
        onDrag={()=>{}}
        dragType="FixedToWorld"
      >
        <ViroSpotLight
          ref={component=>{this.spotLight = component}}
          intensity={modelItem.lighting_mode == "IBL" ? 100 : 1000}
          innerAngle={5}
          outerAngle={20}
          attenuationStartDistance={0.1}
          attenuationEndDistance={22}
          direction={[0,-1,0]}
          position={[modelItem.spotlight_position_x == undefined ? 0 : modelItem.spotlight_position_x, modelItem.spotlight_position_y == undefined ? 6 : modelItem.spotlight_position_y, modelItem.spotlight_position_z == undefined ? 0 : modelItem.spotlight_position_z]}
          color="#ffffff"
          castsShadow={true}
          influenceBitMask={this.props.bitMask}
          shadowNearZ={.1}
          shadowFarZ={modelItem.shadowfarz == undefined ? 6 : modelItem.shadowfarz * this.state.scale[0]}
          shadowOpacity={.9} />
        <ViroNode position={modelItem.position}>
          <Viro3DObject
            source={modelItem.obj}
            type={modelItem.type}
            materials={"pbr"}
            resources={modelItem.resources}
            animation={{...modelItem.animation, "run": this.state.runAnimation}}
            lightReceivingBitMask={this.props.bitMask | 1}
            shadowCastingBitMask={this.props.bitMask}
            onClickState={this._onClickState(this.props.modelIDProps.uuid)}
            onClick={()=>{}}
            onError={this._onError(this.props.modelIDProps.uuid)}
            onRotate={this._onRotate}
            onPinch={this._onPinch}
            onLoadStart={this._onObjectLoadStart(this.props.modelIDProps.uuid)}
            onLoadEnd={this._onObjectLoadEnd(this.props.modelIDProps.uuid)}/>
          {renderIf(this.state.showParticles && modelItem.emitter_name !== undefined, <ParticleEmitter modelName={modelItem.name}/>)}
        </ViroNode>
        <ViroQuad
          rotation={[-90, 0, 0]}
          position={[0, -.001, 0]}
          width={modelItem.shadow_width == undefined ? 2.5 : modelItem.shadow_width} 
          height={modelItem.shadow_height == undefined ? 2.5 : modelItem.shadow_height}
          lightReceivingBitMask={this.props.bitMask | 1}
          arShadowReceiver={true}
          ignoreEventHandling={true}
        />
      </ViroNode>
    );
  },

  _setARNodeRef(component) {
    this.arNodeRef = component;
  },
  _onClickState(uuid) {
    return (clickState, position, source)=> {
      if (clickState == 1) { 
        this.setState({
          itemClickedDown : true,
        });
        TimerMixin.setTimeout(
          () => {
            this.setState({
              itemClickedDown: false,
            });
          },
          200
        );
      }

      if (clickState == 2) { // clickstate == 2 -> "ClickUp"
        // As explained above, within 200 ms, the user's intention is to "tap" the model -> toggle the animation start/stop
        if (this.state.itemClickedDown) {
          {this._onItemClicked()}
        }
        // Irrespective of 200 ms, we call the callback provided in props -> this brings up the context menu on top right
        this.props.onClickStateCallback(uuid, clickState, UIConstants.LIST_MODE_MODEL);
      }
    }
  },
  _onItemClicked() {
    let currentAnimationState = this.state.runAnimation;
    let currentParticlesState = this.state.showParticles;
    this.setState({
      runAnimation: !currentAnimationState,
      showParticles: !currentParticlesState,
      itemClickedDown: false,
    });
  },
  _onRotate(rotateState, rotationFactor, source) {

    if (rotateState == 3) {
      this.setState({
        rotation : [this.state.rotation[0], this.state.rotation[1] + rotationFactor, this.state.rotation[2]]
      });
      this.props.onClickStateCallback(this.props.modelIDProps.uuid, rotateState, UIConstants.LIST_MODE_MODEL);
      return;
    }
    this.arNodeRef.setNativeProps({rotation:[this.state.rotation[0], this.state.rotation[1] + rotationFactor, this.state.rotation[2]]});
  },
  _onPinch(pinchState, scaleFactor, source) {

    var newScale = this.state.scale.map((x)=>{return x * scaleFactor})

    if (pinchState == 3) {
      this.setState({
        scale : newScale
      });
      this.props.onClickStateCallback(this.props.modelIDProps.uuid, pinchState, UIConstants.LIST_MODE_MODEL);
      return;
    }

    this.arNodeRef.setNativeProps({scale:newScale});
    //this.spotLight.setNativeProps({shadowFarZ: 6 * newScale[0]});
  },

  _onError(uuid) {
    return () => {
      this.props.loadCallback(uuid, LoadConstants.ERROR);
      //this.props.arSceneNavigator.viroAppProps.loadingObjectCallback(index, LoadingConstants.LOAD_ERROR);
    };
  },

  _onObjectLoadStart(uuid) {
    return () => {
      this.props.onLoadCallback(uuid, LoadConstants.LOADING);
    };
  },

  _onObjectLoadEnd(uuid) {
    return () => {
      this.props.onLoadCallback(uuid, LoadConstants.LOADED);
      this.props.hitTestMethod(this._onARHitTestResults);
    };
  },
  _onARHitTestResults(position, forward, results) {
    let newPosition = [forward[0] * 1.5, forward[1]* 1.5, forward[2]* 1.5];

    if (results.length > 0) {
      let hitResultPosition = undefined;
      for (var i = 0; i < results.length; i++) {
        let result = results[i];
        if (result.type == "ExistingPlaneUsingExtent" || result.type == "FeaturePoint" && !hitResultPosition) {
          var distance = Math.sqrt(((result.transform.position[0] - position[0]) * (result.transform.position[0] - position[0])) + ((result.transform.position[1] - position[1]) * (result.transform.position[1] - position[1])) + ((result.transform.position[2] - position[2]) * (result.transform.position[2] - position[2])));
          if(distance > .2 && distance < 10) {
            hitResultPosition = result.transform.position;
            break;
          }
        } 
      }
      if (hitResultPosition) {
        newPosition = hitResultPosition;
      }
    }

    this._setInitialPlacement(newPosition);
  },
  _setInitialPlacement(position) {
    this.setState({
        position: position,
    });
    this.setTimeout(() =>{this._updateInitialRotation()}, 500);
  },

  _updateInitialRotation() {
    this.arNodeRef.getTransformAsync().then((retDict)=>{
        let rotation = retDict.rotation;
        let absX = Math.abs(rotation[0]);
        let absZ = Math.abs(rotation[2]);
        let yRotation = (rotation[1]);

        if (absX > 1 && absZ > 1) {
          yRotation = 180 - (yRotation);
        }
        this.setState({
          rotation : [0,yRotation,0],
          shouldBillboard : false,
          nodeIsVisible: true,
        });
      });
  },
});

ViroMaterials.createMaterials({
  pbr: {
    lightingModel: "PBR",
  },
});

module.exports = ModelItemRender;
