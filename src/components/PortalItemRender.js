'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import * as LoadConstants from '../redux/LoadingStateConstants';
import * as UIConstants from '../redux/UIConstants';
import * as PortalData from  '../model/PortalItems';
import TimerMixin from 'react-timer-mixin';
import * as PSConstants from './PSConstants';


import {
  ViroNode,
  Viro3DObject,
  Viro360Image,
  ViroPortalScene,
  ViroPortal,
  ViroImage,
  ViroSphere,
  ViroVideo,
  ViroSpotLight,
  Viro360Video,
} from 'react-viro';

var createReactClass = require('create-react-class');
var PortalItemRender = createReactClass({
  mixins: [TimerMixin],
  propTypes: {
    portalIDProps: PropTypes.any,
    onLoadCallback: PropTypes.func,
    onClickStateCallback: PropTypes.func,
    hitTestMethod: PropTypes.func,
  },

  getInitialState() {
    return {
      scale : PortalData.getPortalArray()[this.props.portalIDProps.index].scale,
      rotation : [0, 0, 0],
      nodeIsVisible : false,
      position: [0, 2, 1], // make it appear initially high in the sky
      shouldBillboard : true,
      insidePortal: false,
      itemClickedDown: false,
    }
  },

  componentDidMount() {
    this._portalData = PortalData.getPortalArray();
  },
  render: function() {
    var portalItem = PortalData.getPortalArray()[this.props.portalIDProps.index];
    let transformBehaviors = {}
    if (this.state.shouldBillboard) {
      transformBehaviors.transformBehaviors = this.state.shouldBillboard ? "billboardY" : [];
    }
    return (
      <ViroNode
        {...transformBehaviors}
        key={this.props.portalIDProps.uuid}
        ref={this._setARNodeRef}
        visible={this.state.nodeIsVisible}
        position={this.state.position}
        scale={this.state.scale}
        rotation={this.state.rotation}
        onDrag={()=>{}} >

        <ViroSpotLight
          innerAngle={5}
          outerAngle={20}
          direction={[0,-1,-.2]}
          position={[0, 5, 1]}
          color="#ffffff"
          castsShadow={true}
          influenceBitMask={this.props.bitMask}
          shadowNearZ={.1}
          shadowFarZ={5}
          shadowOpacity={.9} />

          <ViroPortalScene
            position={portalItem.position}
            onRotate={this._onRotate}
            onPinch={this._onPinch}
            passable={true}
            scale={portalItem.portalScale}
            onClickState={this._onClickState(this.props.portalIDProps.uuid)}
            onPortalEnter={this._onPortalEnter}
            onPortalExit={this._onPortalExit} >

            <ViroPortal>
              <Viro3DObject
                source={portalItem.obj}
                materials={portalItem.materials}
                resources={portalItem.resources}
                type={portalItem.frameType}
                onLoadStart={this._onObjectLoadStart(this.props.portalIDProps.uuid)}
                onLoadEnd={this._onObjectLoadEnd(this.props.portalIDProps.uuid)}
                lightReceivingBitMask={this.props.bitMask | 1}
                shadowCastingBitMask={this.props.bitMask} />
              }
            </ViroPortal>
            {this._renderPortalInside(portalItem)}
          </ViroPortalScene>
      </ViroNode>
    );
  },

  _setARNodeRef(component) {
    this.arNodeRef = component;
  },

  _onClickState(uuid) {
    return (clickState, position, source)=> {
      if (clickState == 1) { // clickState == 1 -> "ClickDown"
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

      if (clickState == 2) { // clickState == 2 -> "ClickUp"
        this.props.onClickStateCallback(uuid, clickState, UIConstants.LIST_MODE_PORTAL);
      }
    }
  },

  _renderPortalInside(portalItem) {
    var portalSource = (this.props.portalIDProps.portal360Image != undefined && this.props.portalIDProps.portal360Image != null) ? this.props.portalIDProps.portal360Image: portalItem.portal360Image;
    if(this._is360Photo(portalSource, portalSource.width, portalSource.height)) {
        if (portalSource.type == PSConstants.PS_TYPE_360_VIDEO) {
        return (
          <Viro360Video key="background_portal_video" muted={!this.state.insidePortal} volume={1.0} source={portalSource.source} loop={true} />
        );
      } else {
        return (
          <Viro360Image key="background_portal" source={portalSource.source} />
        );
      }
    } else {
      var viewArray = [];
      if(this._isVideo(portalSource.source.uri)) {
        viewArray.push(<ViroSphere  position={[0,0,0]} radius={56} facesOutward={false} key="background_portal" materials="theatre" />);
        viewArray.push(<ViroVideo key="image_portal" width={1} height={1}  source={portalSource.source} position={[0, 3.9, -39]} scale={[42, 21, 1]} />);
      } else {
        viewArray.push(
          <ViroSpotLight key="obj_spotlight"
            innerAngle={5}
            outerAngle={20}
            direction={[0,-1,0]}
            position={[0, 6, 0]}
            color="#ffffff"
            castShadows={true}
            shadowNearZ={.1}
            shadowFarZ={5}
            shadowOpacity={.9}
          />);
        viewArray.push(
          <Viro3DObject
            key="obj_3d"
            position={[0,-2,-6]}
            scale={[0.5,0.5,0.5]}
            source={require('../res/art_gallery/artgallery3.vrx')}
            resources={[
              require('../res/art_gallery/art_gallery_projector_diffuse.png'),
              require('../res/art_gallery/art_gallery_projector_specular.png'),
              require('../res/art_gallery/art_gallery_walls_diffuse.png'),
              require('../res/art_gallery/art_gallery_walls_specular.png')
            ]}
            type="VRX" />
          );
        viewArray.push(
          <ViroImage
            key="image_portal"
            width={2}
            height={4}
            resizeMode='ScaleToFill'
            imageClipMode='None'
            source={portalSource.source}
            position={[0, 0.8,-5.8]}
            scale={[1, 1, 1]}
          />
        );
        viewArray.push(<Viro360Image key="background_portal_image" source={require('../res/360_space.jpg')} />);
      }
      return viewArray;
    }
  },

  _isVideo(videoUri) {
    return (videoUri.toLowerCase().endsWith("mov") || videoUri.toLowerCase().endsWith("mp4"));
  },

  _is360Photo(source, width, height) {
    let ratio = width / height;
    return (ratio > 1.9 && ratio < 2.2);
  },

  _onRotate(rotateState, rotationFactor, source) {
    if (rotateState == 3) {
      this.setState({
        rotation : [this.state.rotation[0], this.state.rotation[1] + rotationFactor, this.state.rotation[2]]
      });
      this.props.onClickStateCallback(this.props.portalIDProps.uuid, rotateState, UIConstants.LIST_MODE_MODEL);
      return;
    }
    this.arNodeRef.setNativeProps({rotation:[this.state.rotation[0], this.state.rotation[1] + rotationFactor, this.state.rotation[2]]});
  },

  _onPinch(pinchState, scaleFactor, source) {
    var newScale = this.state.scale.map((x)=>{return x * scaleFactor})

    if(pinchState == 3) {
      this.setState({
        scale : newScale
      });
      this.props.onClickStateCallback(this.props.portalIDProps.uuid, pinchState, UIConstants.LIST_MODE_MODEL);
      return;
    }

    this.arNodeRef.setNativeProps({scale:newScale});
  },

  _onError(uuid) {
      return () => {
        this.props.loadCallback(uuid, LoadConstants.ERROR);
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
    let scaledForwardVector = [forward[0] * 1.2, forward[1]* 1.2, forward[2]* 1.2];
    let newPosition = [position[0] + scaledForwardVector[0], position[1] + scaledForwardVector[1], position[2] + scaledForwardVector[2]];
    this._setInitialPlacement(newPosition);
  },
  _onPortalEnter() {
    this.setState({
      insidePortal:true,
    });
  },

  _onPortalExit() {
    this.setState({
      insidePortal:false,
    });
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

module.exports = PortalItemRender;
