/**
 * entry-textarea.jsx
 * Textarea for entries
 */

import React, { Component } from 'react';
import autobind from 'autobind-decorator';

@autobind
export default class EntryTextarea extends Component {

  static propTypes() {
    return {
      value: React.PropTypes.string,
      onChange: React.PropTypes.function,
      onBlur: React.PropTypes.function,
    };
  }

  constructor() {
    super();
    this.state = {
      style: {},
    };
  }

  componentDidMount() {
    // set initial height
    this.setHeight(this.textarea);
  }

  onChange(evt) {
    // update the textarea height
    this.setHeight(evt.currentTarget);

    const { currentTarget } = evt;

    let caretPos = evt.currentTarget.selectionStart;
    const value = evt.currentTarget.value;

    // first character, prefix with a bullet.
    if (value.length === 1 && value !== '•') {
      currentTarget.value = `• ${value}`;
      caretPos = 3;
    }

    // add a bullet after a newline
    if (value.charAt(caretPos - 2) === '\n' && value.charAt(caretPos - 1) !== '•') {
      currentTarget.value = `${value.substr(0, caretPos - 1)}• ${value.substr(caretPos - 1)}`;
      caretPos += 2;
    }

    currentTarget.selectionStart = caretPos;
    currentTarget.selectionEnd = caretPos;

    // pass up to any onChange handler put on the component
    if (this.props.onChange) this.props.onChange(evt);
  }

  onBlur(evt) {
    // pass to the onBlur handler of the component, if it exists
    if (this.props.onBlur) this.props.onBlur(evt);
  }

  // reset the height of the textarea by setting it to auto, calculating
  // the height of the scroll area, and then resizing.
  setHeight(textarea) {
    this.setState({
      style: {
        height: 0,
      },
    });
    requestAnimationFrame(() => {
      this.setState({
        style: {
          height: `${textarea.scrollHeight}px`,
        },
      });
    });
  }

  render() {
    return (<textarea
      ref={(c) => { this.textarea = c; }}
      style={this.state.style}
      onChange={this.onChange}
      onBlur={this.onBlur}
      value={this.props.value || ''}
    />);
  }

}
