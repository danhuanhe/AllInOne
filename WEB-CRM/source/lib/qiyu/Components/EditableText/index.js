import React, { Component } from 'react';
import {Input,Icon} from 'ppfish';
import PropTypes from 'prop-types';
import './index.less';


class EditableText extends Component{

    constructor(props){
        super(props);

        this.state = {
            editable: false,
            preEditable: false,
            text: this.props.text
        };

        document.addEventListener('click', this.handleBlur);
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.text !== this.props.text){
            this.setState({text: nextProps.text});
        }
    }

  componentWillUnmount(){
      document.removeEventListener('click', this.handleBlur);
  }

    handleMouseEnter = (event) => {
        this.setState({
            preEditable: true
        });
    }

    handleMouseLeave = (event) => {
        if(!this.state.editable){
            this.setState({
                preEditable: false
            });
        }
    }

    handleClick = (event) => {
        event.nativeEvent.stopImmediatePropagation();
        this.setState({
            editable: true
        });
    }

    handleBlur = (event) => {
      if (this.state.editable){
        this.setState({
          editable: false,
          preEditable: false
        });

        this.props.onBlur ? this.props.onBlur(this.props.infoKey, this.state.text) : null;
      }
    }

    handleClear = (event) => {
        this.refs.input.focus();
        this.setState({
            text: ''
        });
    }

    handleInputChange = (event) => {
        this.setState({
            text: event.target.value
        });

      this.props.onChange ? this.props.onChange(event.target.value) : null;
    }


    render(){

        const props = this.props;
        const suffix = props.text ? <Icon type="close-circle-fill" onClick={this.handleClear} /> : null;

        return(
            <div>
              {
                props.canEdit ?
                  <div className="m-EditableText"
                       onMouseEnter={this.handleMouseEnter}
                       onMouseLeave={this.handleMouseLeave} onClick={this.handleClick}>
                    {
                      this.state.preEditable ?
                        this.state.editable ?
                          <Input ref="input" autoFocus="autofocus" className="EditableText-input" value={this.state.text}
                                 onChange={this.handleInputChange} suffix={suffix}/> :
                          <div className="EditableText-status-editable">{this.state.text}</div>
                        : this.state.text
                    }
                  </div>
                  :
                  <div className="m-EditableText">
                    {this.state.text}
                  </div>
              }
            </div>
        );
    }

}

export default EditableText;
