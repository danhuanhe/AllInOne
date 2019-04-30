import React,{Component} from "react";
import PropTypes from 'prop-types';
import {Radio,Select,Checkbox,Icon,Input,Modal,message,Button} from 'ppfish';
import FieldSet from "../FieldSet";
import {OperatorMap} from "../../constants";
import "./index.less";
class FilterList extends Component{

  static displayName="FilterList";

  static propTypes = {
  
  };

  constructor (props){
    super(props);
    this.state = {
      showEditGName:false,
      fieldType: "1",
      list:[],
      crtFilter:{}
    };
   
  }

  componentDidMount(){
    if(!this._hadLoadFilters){
      this.props.actions.getFilterList();
      this._hadLoadFilters=true;
    }
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.filter&&nextProps.filter.list){
      this.setState({
        list:nextProps.filter.list
      });
    }
      
  }
  onFieldGPChange=(e)=>{
    this.setState({
      fieldType: e.target.value,
    });
  }
  onFieldCheck=(e,field)=>{console.log(field);
    field._open=e.target.checked;
    this.setState({
      list:this.state.list
    });
  }

  openFilterDetail=(filter)=>{
    this.crtFilter=filter;
    this.state.list.map((item)=>{
      if(item.id!=filter.id){
        item._open=false;
      }
      
    });
    filter._open=!filter._open;
    if(filter._open&&!filter.fields){
      this.props.actions.getFilterDetail(filter.id,(data)=>{
        data.filter.map((fff)=>{
          fff._open=true;
          fff.operators=this.props.filter.fieldsMap[fff.id].operators;//客户群列表里的字段列表，包含最终选择的操作operator但不包含可选操作operators，所以需要在这里强制赋值
        });
        filter.fields=data.filter;
        delete filter.filter;//获取客户群列表里返回多余的filter:bull, 前端去掉,让数据源更清晰
        this.setState({
          list:this.state.list
        });
      });
    }else{
      this.setState({
        list:this.state.list
      });
    }
    
  }

  onOprChange=(val,field)=>{
    console.log(OperatorMap[val]);
    field.operator=OperatorMap[val];//给字段设置当前选中的条件操作，用于输入值组件渲染判断
    this.setState({
      list:this.state.list
    });
  }

  onFieldChange=(val)=>{
    //console.log(this.crtFilter);
    if(this.props.onFilterChange){
      this.props.onFilterChange(this.crtFilter);
    }
  }

  handleShowUpGpNameModal=(filter)=>{
    this.setState({
      showEditGName:true,
      crtFilter:filter
    });
    console.log(filter);
  }
  onUpGpNameOk=()=>{
    let newName=this.refs.gpname.input.value;
    this.props.actions.updateFilterName(this.state.crtFilter.id,newName,(json)=>{
      if(json.code==200){
        this.state.crtFilter.name=newName;
        this.setState({
          showEditGName:false,
          list:this.state.list
        });
      }else{
        message.error(json.message||"修改客户群名称失败！");
      }
     
    });
   
  }

  onUpGpNameCancel=()=>{
    this.setState({
      showEditGName:false
    });
  }

  handleDelFilter=(filter,index)=>{
    Modal.confirm({
      title: '删除该客群',
      content: '确认删除该客群？删除后不可恢复.',
      okText: '确认',
      cancelText: '取消',
      onOk:()=>{
        this.props.actions.deleteFilter(filter.id,(json)=>{
          if(json.code==200){
            this.state.list.splice(index,1);
            this.setState({
              list:this.state.list
            });
          }else{
            message.error(json.message||"删除客户群名称失败！");
          }
         
        });
      }
    });
  }

  handleAddField=(filter)=>{
    filter.fields.push({
      id:999999999,
      _isNew:true
    });
    this.setState({
      list:this.state.list
    });
    this._canSelFields=this._getCanSelFields();
  }

  _getCanSelFields=()=>{
    let canSelFields=[{id:999999999,name:"请选择"}];
    const {fields}=this.props.filter;
    if(this.crtFilter&&this.crtFilter.fields){
      let oldFields=this.crtFilter.fields;
      fields.map((fff)=>{
        if(!oldFields.some((ff)=>{return ff.id==fff.id})){
          canSelFields.push(fff);
        }
      });
      
    }console.log(canSelFields);
    return canSelFields;
  }
  handleFiledSel=(val,field)=>{
    Object.assign(field,this.props.filter.fieldsMap[val]);
    field._open=true;
    this.setState({
      list:this.state.list
    });
    console.log(this.crtFilter);
  }
  handleUpdateFilter=()=>{
    let params={
      id:this.crtFilter.id,
      relation:1,
      filter:[],
      name:this.crtFilter.name
    };
    this.crtFilter.fields.map((v)=>{
      params.filter.push({
        id:v.id,name:v.name,operator:v.operator,type:v.type,value:v.value,valueEx:v.valueEx||""
      });
    });
    
    this.props.actions.updateFilter(params,(json)=>{
      if(json.code==200){
        message.success("更新客户群成功！",1);
      }else{
        message.error(json.message||"更新客户群失败！",2);
      }
      this.setState({
        showEditGName:false
      });
    });
    console.log(params);
  }
  render(){
    const {list}=this.state;
    const {leaders}=this.props.filter;
    return (
      <div className="m-filterlist">
        {
          list.map((filter,index)=>(
            <div key={filter.id}>
              
              <div className={filter._open?"filter-name filter-name-open":"filter-name"}>
                <span className="iconfont icon-staffx"></span><span className="sgname">{filter.name}</span><Icon type={filter._open?"up-fill":"down-fill"} onClick={()=>this.openFilterDetail(filter)}/>
              </div>
            {filter._open&&filter.fields?(
              <div className="m-filter-set">
                <div className="filter-update">
                  <a onClick={()=>{this.handleShowUpGpNameModal(filter)}}>修改群名称</a>
                  <a onClick={()=>{this.handleDelFilter(filter,index)}}>删除客群</a>
                </div>
                <div className="m-fields-set">
                  {filter.fields.map((field)=><div key={field.id} className="field-set">
                    <div className="fieldcheck">
                      {!field._isNew?<Checkbox checked={field._open} onChange={(e)=>{this.onFieldCheck(e,field)}}>{field.name}</Checkbox>:
                      <div>
                        <Checkbox checked={field._open} onChange={(e)=>{this.onFieldCheck(e,field)}}></Checkbox>
                        <Select className="fieldcheck-sel"  defaultValue={field.id} onChange={(e)=>{this.handleFiledSel(e,field)}} mode="single" size="small" style={{width:"60%"}}>
                          {this._canSelFields.map((selField)=><Select.Option key={selField.id} value={selField.id}>{selField.name}</Select.Option>)}
                        </Select>
                      </div>}
                      
                    </div>
                    {field._open?<div className="fieldval">
                      <Select className="fieldval-opr" defaultValue={field.operator.id} onChange={(e)=>{this.onOprChange(e,field)}} mode="single" size="small" style={{width:"100%"}}>
                        {field.operators.map((opr)=><Select.Option key={opr.id} value={opr.id}>{opr.desc}</Select.Option>)}
                      </Select>
                      <FieldSet field={field} leaders={leaders} onFieldChange={this.onFieldChange}/>
                    </div>:null}
                  </div>)}
                </div>
                <div className="filter-add">
                  <a onClick={()=>{this.handleAddField(filter)}}><Icon type="upload-plus" />新增筛选条件</a>
                  <Button size="small" onClick={this.handleUpdateFilter}>保存</Button>
                </div>
              </div>):null}
              
            </div>
          ))
        }
        <Modal
            title="编辑客户群"
            visible={this.state.showEditGName}
            onOk={this.onUpGpNameOk}
            onCancel={this.onUpGpNameCancel}
          >
            <dl className="m-groupname-form">
              <dt>客户群名称<span className="require">*</span></dt>
              <dd>
                <Input ref="gpname" defaultValue={this.state.crtFilter.name}/>
              </dd>
            </dl>
          </Modal>
      </div>
    );
  }
}

export default FilterList;