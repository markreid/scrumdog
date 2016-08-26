/**
 * entry-textarea.jsx
 * Textarea for entries
 */

import React from 'react';
import {Component} from 'react';
import {connect} from 'react-redux';

export default class EntryTextarea extends Component{

    constructor(){
        super();
        this.state = {
            style: {}
        };
    }

    render(){
        return <textarea style={this.state.style} onChange={this.onChange.bind(this)} onBlur={this.onBlur.bind(this)} value={this.props.value}></textarea>
    }

    onChange(evt){
        // update the textarea height
        this.setHeight(evt.currentTarget);

        var caretPos = evt.currentTarget.selectionStart;
        var value = evt.currentTarget.value;

        // first character, prefix with a bullet.
        if(value.length === 1 && value !== '•'){
            evt.currentTarget.value = '• ' + value;
            caretPos = 3;
        }

        // add a bullet after a newline
        if(value.charAt(caretPos-2) === '\n' && value.charAt(caretPos-1) !== '•'){
            evt.currentTarget.value = value.substr(0, caretPos-1) + '• ' + value.substr(caretPos-1);
            caretPos += 2;
        }

        evt.currentTarget.selectionStart = caretPos;
        evt.currentTarget.selectionEnd = caretPos;

        // pass up to any onChange handler put on the component
        if(this.props.onChange) this.props.onChange(evt);


    }

    onBlur(evt){
        // pass to the onBlur handler of the component, if it exists
        if(this.props.onBlur) this.props.onBlur(evt);
    }


    componentDidMount(){
        // update the height on initial render
        var textarea = React.findDOMNode(this);
        this.setHeight(textarea);
    }


    // reset the height of the textarea by setting it to auto, calculating
    // the height of the scroll area, and then resizing.
    setHeight(textarea){
        this.setState({
            style: {
                height: 'auto'
            }
        });
        requestAnimationFrame(() => {
            this.setState({
                style: {
                    height: textarea.scrollHeight + 'px'
                }
            });
        });

    }

}

