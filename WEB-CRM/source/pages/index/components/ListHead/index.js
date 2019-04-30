import React, { Component } from 'react';
import PropTypes from 'prop-types';

import "./index.less";

class ListHead extends Component{
    static displayName="ListHead";

    static propTypes = {
    
    };

    //子孙组件中声明，指定要接收的context的结构类型，可以只是context的一部分结构。contextTypes 没有定义，context将是一个空对象。
    static contextTypes = {
      
    };
    //根组件中声明，指定context的结构类型，如不指定，会产生错误
    static childContextTypes = {
      test:PropTypes.string
    };

    //mixins: [{m:()=>0}];//this.m();  不建议

    //==react.createClass方式的getDefaultProps函数的返回值
    static defaultProps={
       title:"模块标题"
    }

    constructor (props){
      super(props);
      this.state = {
        title: props.title
      };
    }

    //根组件中声明，一个函数，返回一个对象，就是context
    getChildContext() {
      return {test:"test"};
    }

    componentWillMount(){

    }
    componentDidMount(){
      
    }
    componentWillReceiveProps(nextProps){
      
    }
    // shouldComponentUpdate(){
      
    // }
    componentWillUpdate(){
      
    }
    componentDidUpdate(){
      
    }
    componentWillUnmount(){
      
    }
    //**********//
    
    //**********//
    render(){
      const {title}=this.props;
      return (<div>
        {title}
      </div>);
    };

}

export default ListHead;