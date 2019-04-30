import React,{Component} from "react";
import PropTypes from 'prop-types';
import {Radio,Select,Checkbox,Button,Modal,Input,message} from 'ppfish';
import FieldSet from "../FieldSet";
import {OperatorMap} from "../../constants";
import "./index.less";
class FilterSet extends Component{

  static displayName="FilterSet";

  static propTypes = {
  
  };

  constructor (props){
    super(props);
    this.state = {
      fieldType: "1",
      fields:[],
      canCreateFilter:false,
      showEditGName:false,
      filterName:""
    };
    this.filterSet={
      fieldsMap:{}
    };
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.filter&&nextProps.filter.fields){
      this.setState({
        fields:nextProps.filter.fields
      });
    }
      
  }
  onFieldGPChange=(e)=>{
    this.setState({
      fieldType: e.target.value,
    });
  }
  onFieldCheck=(e,field)=>{
    let hadField=false;
    field._open=e.target.checked;
    if(field._open&&field.value){
      this.filterSet.fieldsMap[field.id]=field;
      hadField=true;
    }else{
      delete this.filterSet.fieldsMap[field.id];
      hadField=Object.keys(this.filterSet.fieldsMap).length>0;
    }
    this.setState({
      fields:this.state.fields,
      canCreateFilter:hadField
    });

  }

  onOprChange=(val,field)=>{
    console.log(OperatorMap[val]);
    field.operator=OperatorMap[val];//给字段设置当前选中的条件操作，用于输入值组件渲染判断
    this.setState({
      fields:this.state.fields
    });
  }

  onFieldChange=(val)=>{
    //console.log(val);
    let hadField=false;
    if(val.value){
      this.filterSet.fieldsMap[val.id]=val;
      hadField=true;
    }else{
      delete this.filterSet.fieldsMap[val.id];
      hadField=Object.keys(this.filterSet.fieldsMap).length>0;
    }
    this.setState({
      canCreateFilter:hadField
    });
    if(this.props.onFilterChange){
      let filter=this._getFilterParams();
      filter.fields=filter.filter;
      delete filter.filter;
      this.props.onFilterChange(filter);
    }
    

  }
  handleSaveFilter=()=>{
   
    this.setState({
      showEditGName:true
    });
  }

  _getFilterParams=()=>{
    let params={
      relation:1,
      filter:[],
      name:this.state.filterName
    };
    let vals=Object.values(this.filterSet.fieldsMap);
    vals.map((v)=>{
      params.filter.push({
        id:v.id,name:v.name,operator:v.operator,type:v.type,value:v.value,valueEx:v.valueEx||""
      });
    });
    return params;
  }
  handleSaveFilterOk=()=>{
    
    
    this.props.actions.saveFilter(this._getFilterParams(),(json)=>{
      if(json.code==200){
        message.success("创建客户群成功！",1);
      }else{
        message.error(json.message||"创建客户群失败！",2);
      }
      this.setState({
        showEditGName:false
      });
      this.props.onSaveFilterOk();
    });
    console.log(params);
  }

  handleSaveFilterCancel=()=>{
    this.setState({
      showEditGName:false
    });
  }

  render(){
    const RadioGroup=Radio.Group;
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };
    const {fields,canCreateFilter,filterName}=this.state;
    const {leaders}=this.props.filter;
    return (
      <div className="m-filterset">
        <div className="fields-gp">
          <RadioGroup onChange={this.onFieldGPChange} value={this.state.fieldType} style={{width:"100%"}}>
            <Radio style={radioStyle} value="1">用户属性</Radio>
            <Radio style={radioStyle} value="2">行为轨迹</Radio>
        </RadioGroup>
        </div>
        <div className="m-fields-set">
          {fields.map((field)=><div key={field.id} className="field-set">
            <div className="fieldcheck"><Checkbox onChange={(e)=>{this.onFieldCheck(e,field)}}>{field.name}</Checkbox></div>
            {field._open?<div className="fieldval">
              <Select className="fieldval-opr" defaultValue={field.operator.id} onChange={(e)=>{this.onOprChange(e,field)}} mode="single" size="small" style={{width:"100%"}}>
                {field.operators.map((opr)=><Select.Option key={opr.id} value={opr.id}>{opr.desc}</Select.Option>)}
              </Select>
              <FieldSet field={field} leaders={leaders} onFieldChange={this.onFieldChange}/>
            </div>:null}
          </div>)}
        </div>
        <div className="filter-save">
          <Button size="small" disabled={!canCreateFilter} onClick={this.handleSaveFilter}>保存为客户群</Button>
        </div>
        <Modal
            title="保存为客户群"
            visible={this.state.showEditGName}
            onOk={this.handleSaveFilterOk}
            onCancel={this.handleSaveFilterCancel}
            okButtonDisabled={true}
          >
            <dl className="m-groupname-form">
              <dt>客户群名称<span className="require">*</span></dt>
              <dd>
                <Input onChange={(e)=>{this.setState({filterName:e.target.value});}} placeholder="请输入客户群名称"/>
              </dd>
            </dl>
          </Modal>
      </div>
    );
  }
}

export default FilterSet;