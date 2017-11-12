import React from 'react';
import './Loader.css';

const Loader = React.createClass({
  propTypes: {
    type: React.PropTypes.string,
    busy: React.PropTypes.bool
  },

  renderBusy() {
    const { type } = this.props;

    if (type === 'Image') {
      return (
        <div className="Loader-Image">
          <div className="sk-cube1 sk-cube"></div>
          <div className="sk-cube2 sk-cube"></div>
          <div className="sk-cube4 sk-cube"></div>
          <div className="sk-cube3 sk-cube"></div>
        </div>
      );
    }
    else {
      return (
        <div className="Loader-Stats">Loading...</div>
      );
    }
  },

  renderChildren() {
    return (
      <div>
        { this.props.children }
      </div>
    );
  },

  render() {
    const { busy } = this.props;

    if (busy) {
      return this.renderBusy();
    } else {
      return this.renderChildren();
    }
  }
});

export default Loader;
