/**
 * Loader component
 */

import React from 'react';
import {Component} from 'react';


export default class Loader extends Component {
    render () {
        return (
            <div className={'loader-wrapper ' + (this.props.size || '') }>
                <div className={'loader ' + (this.props.size || '')}></div>
            </div>
        )
    }
}
