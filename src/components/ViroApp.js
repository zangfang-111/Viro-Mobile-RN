import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import {
  addPortalWithIndex,
  addModelWithIndex,
  toggleEffectSelection,
  changePortalLoadState,
  changeModelLoadState,
  changeItemClickState
} from '../redux/actions';

import * as LoadingConstants from '../redux/LoadingStateConstants';
import * as UIConstants from '../redux/UIConstants';
import renderIf from '../helpers/renderIf';
import FigmentListView from './FigmentListView';
import * as ModelData from  '../model/ModelItems';
import * as PortalData from  '../model/PortalItems';

const kPreviewTypeVideo = 2;

import { View, StyleSheet, StatusBar } from 'react-native';
import { ViroARSceneNavigator } from 'react-viro';

var InitialScene = require('./figment');

export class ViroApp extends Component {

  constructor(props) {
    super(props);
    this._setARNavigatorRef = this._setARNavigatorRef.bind(this);
    this._onListItemLoaded = this._onListItemLoaded.bind(this);
    this._onListPressed = this._onListPressed.bind(this);
    this._getListItems = this._getListItems.bind(this);
    this._onItemClickedInScene = this._onItemClickedInScene.bind(this);
    this._getLoadingforModelIndex = this._getLoadingforModelIndex.bind(this);
    this._constructListArrayModel = this._constructListArrayModel.bind(this);

    this.state = {
      viroAppProps: {loadingObjectCallback: this._onListItemLoaded, clickStateCallback: this._onItemClickedInScene},
      previewType: kPreviewTypeVideo,
    }
  }
  render() {
    return (
      <View style={localStyles.flex}>
        <StatusBar hidden={true} />
        <ViroARSceneNavigator 
          style={localStyles.arView} 
          apiKey="FFF99D69-EDF2-4EE7-B991-CA415E05E255"
          initialScene={{scene: InitialScene}}  
          ref={this._setARNavigatorRef} 
          viroAppProps={this.state.viroAppProps}
        />
        {renderIf(this.props.currentScreen != UIConstants.SHOW_SHARE_SCREEN,
          <View style={localStyles.listView}>
            <FigmentListView items={this._getListItems()} onPress={this._onListPressed} />
          </View>
        )}
      </View>
    );
  }
  _setARNavigatorRef(ARNavigator){
    this._arNavigator = ARNavigator;
  }
  _onListPressed(index) {
    if(this.props.listMode == UIConstants.LIST_MODE_MODEL) {
      this.props.dispatchAddModel(index);
    }
    if(this.props.listMode == UIConstants.LIST_MODE_PORTAL) {
      this.props.dispatchAddPortal(index);
    }
    if(this.props.listMode == UIConstants.LIST_MODE_EFFECT) {
      this.props.dispatchToggleEffectSelection(index);
    }
  }
  _onListItemLoaded(index, loadState) {
    if(this.props.listMode == UIConstants.LIST_MODE_MODEL) {
      this.props.dispatchChangeModelLoadState(index, loadState);
    }
    if(this.props.listMode == UIConstants.LIST_MODE_PORTAL) {
      this.props.dispatchChangePortalLoadState(index, loadState);
    }
  }
  _onItemClickedInScene(index, clickState, itemType) {
    this.props.dispatchChangeItemClickState(index, clickState, itemType);
  }
  _getListItems() {
    if(this.props.listMode == UIConstants.LIST_MODE_MODEL) {
      return this._constructListArrayModel(ModelData.getModelArray(), this.props.modelItems);
    }else if(this.props.listMode == UIConstants.LIST_MODE_PORTAL) {
      return this._constructListArrayModel(PortalData.getPortalArray(), this.props.portalItems);
    } else if(this.props.listMode == UIConstants.LIST_MODE_EFFECT) {
      return this.props.effectItems;
    }
  }
  _constructListArrayModel(sourceArray, items) {
    var listArrayModel = [];
    for(var i =0; i<sourceArray.length; i++) {
        listArrayModel.push({icon_img:sourceArray[i].icon_img, loading:this._getLoadingforModelIndex(i, items)})
    }
    return listArrayModel;
  }
  _getLoadingforModelIndex(index, items) {
    if(items == null || items == undefined) {
      return LoadingConstants.NONE;
    }
    var loadingConstant = LoadingConstants.NONE;
    Object.keys(items).forEach(function(currentKey) {
      if(items[currentKey] != null && items[currentKey] != undefined) {
        if(items[currentKey].loading != LoadingConstants.NONE && items[currentKey].index == index){
          loadingConstant = items[currentKey].loading;
        }
      }
    });
    return loadingConstant;
  }
}

ViroApp.propTypes =  {
  objIndex: PropTypes.number.isRequired,
}

ViroApp.defaultProps =  {
  objIndex: -1,
}

var localStyles = StyleSheet.create({
  flex : {
    flex : 1,
  },
  arView: {
    flex:1,
  },
  listView: {
    flex:1,
    height : 72,
    width : '100%',
    position : 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom : 0,
    backgroundColor: '#000000aa'
  }
})

function selectProps(store) {
  return {
    modelItems: store.arobjects.modelItems,
    portalItems: store.arobjects.portalItems,
    effectItems: store.arobjects.effectItems,
    currentScreen: store.ui.currentScreen,
    listMode: store.ui.listMode,
    listTitle: store.ui.listTitle,
  };
}

// -- dispatch REDUX ACTIONS map
const mapDispatchToProps = (dispatch) => {
  return {
    dispatchAddPortal: (index) => dispatch(addPortalWithIndex(index)),
    dispatchAddModel: (index) => dispatch(addModelWithIndex(index)),
    dispatchToggleEffectSelection: (index) => dispatch(toggleEffectSelection(index)),
    dispatchChangeModelLoadState:(index, loadState) =>dispatch(changeModelLoadState(index, loadState)),
    dispatchChangePortalLoadState:(index, loadState) =>dispatch(changePortalLoadState(index, loadState)),
    dispatchChangeItemClickState:(index, clickState, itemType) =>dispatch(changeItemClickState(index, clickState, itemType)),
  }
}

export default connect(selectProps, mapDispatchToProps)(ViroApp)
