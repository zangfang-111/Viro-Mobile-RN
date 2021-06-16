'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EmojiAngryEmitter from './EmojiAngryEmitter';
import BirthdayCakeEmitter from './BirthdayCakeEmitter';

class ParticleEmitter extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.modelName == undefined) return null
    switch(this.props.modelName) {
      case 'emoji_angry': {
        return (<EmojiAngryEmitter onClick={this.props.onClick}/>);
      }
      case 'object_bday_cake': {
        return (<BirthdayCakeEmitter onClick={this.props.onClick}/>);
      }
      default: {
        return null;
      }
    }
  }
}

ParticleEmitter.propTypes = {
  onClick: PropTypes.func,
  modelName: PropTypes.string,
}

export default ParticleEmitter;