'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ViroNode } from 'react-viro';

class EffectItemRender extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    var j = this.props.index;
    return (
      <ViroNode key={j} >
        {this.props.effectItem.effect()}
      </ViroNode>
    )
  }
};

EffectItemRender.propTypes = {
  effectItem: PropTypes.any,
  index: PropTypes.number,
};

module.exports = EffectItemRender;
