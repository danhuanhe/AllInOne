import React,{Component} from "react";
import PropTypes from 'prop-types';
import {Input,Select,DatePicker} from 'ppfish';

class FieldSet extends Component{
  static displayName="FieldSet";

  static propTypes = {
  
  };

  constructor (props){
    super(props);
    this.state = {
      field:props.field||{}
    };
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.field){
      this.setState({
        field:nextProps.field
      });
    }
  }
  _setTextValue=(e)=>{
    this.state.field.value=e.target.value;
    //console.log(this.state.field);
    if(this.props.onFieldChange){
      window.clearTimeout(this.textTimer);
      this.textTimer=window.setTimeout(()=>this.props.onFieldChange(this.state.field),500);
    }
    
  }

  //七日类字段控件触发事件
  _setDateValue=(date)=>{
    if(date.length==2){
      this.state.field.value=date[0];
      this.state.field.valueEx=date[1];
    }else{
      this.state.field.valueEx=null;
      this.state.field.value=date;
    }
    if(this.props.onFieldChange){
      this.props.onFieldChange(this.state.field);
    }
    //console.log(this.state.field);
  }

  _string2Arr=(str)=>{
    if(str&&typeof str=="string"){
      let valArr=str.indexOf(";")>0?str.split(";"):[str];
      let newV=[];
      valArr.map((v)=>{newV.push({key:v})});
      return newV;
    }

    return [];
  }
  //单选，多选，负责人选择回调函数
  _selectChange=(val)=>{
    if(val.length){
      this.state.field.value=val.reduce((prev,crt,index)=>{prev.push(crt.key);return prev;},[]).join(";");
    }else{
      this.state.field.value=val.key|"";
    }
    if(this.props.onFieldChange){
      this.props.onFieldChange(this.state.field);
    }
    //console.log(this.state.field);
  }
  getFormCtrl=()=>{
    let {description,id,name,operator,type,value,valueEx}=this.state.field;
    const {leaders}=this.props;
    if(!operator){
      operator={};
    }
    
    if(type==0){
      if(operator.id<3){
        return <div className="fieldval-ipt"><Input placeholder="" defaultValue={value} onChange={this._setTextValue} /></div>;
      }else{
        return null;
      }
    }
    if(type==1){
      if(description&&description.length>2){
        value=this._string2Arr(value);
        let items=JSON.parse(description);
        return <div className="fieldval-ipt"><Select style={{width: "100%"}} labelInValue  defaultValue={{key:value}}
                onChange={this._selectChange} value={value}>
         {items.map((d) => <Select.Option key={d.text} title={d.text}>{d.text}</Select.Option>)}
       </Select></div>;
      }
      return null;
    }
    if(type==2){
      if(id==-22){
        value=this._string2Arr(value);
        return <div className="fieldval-ipt"><Select style={{width: "100%"}} showSelectAll mode="multiple" labelInValue
                 onChange={this._selectChange} value={value}>
          {leaders.map(d => <Select.Option key={d.id} title={d.realname}>{d.realname}</Select.Option>)}
        </Select></div>;
      }else{
        if(description&&description.length>2){
          value=this._string2Arr(value);
          let items=JSON.parse(description);
          return <div className="fieldval-ipt"><Select style={{width: "100%"}} showSelectAll mode="multiple" labelInValue
                  onChange={this._selectChange} value={value}>
           {items.map((d) => <Select.Option key={d.text} title={d.text}>{d.text}</Select.Option>)}
         </Select></div>;
        }
      }
      return null;
    }
    if(type==3){
        if(value&&typeof value!="object"){
          value=new Date(+value);
        }
        if(valueEx&&typeof valueEx!="object"){
          valueEx=new Date(+valueEx);
        }
        if(operator.id==5){
          //介于
          return <div className="fieldval-ipt"><DatePicker.DateRangePicker
            style={{width: "100%"}}
            allowClear={false}
            value1={value}
            value2={valueEx}
            onChange={this._setDateValue}
          /></div>
        }else{
          return <div className="fieldval-ipt"><DatePicker
          style={{width: "100%"}}
          value={value}
          onChange={this._setDateValue}
          /></div>;
        }
        return null;
    }
    return null;
  }

  render(){

    return this.getFormCtrl();
  }
}

export default FieldSet;