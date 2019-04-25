import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Form, Modal, Button, Input, Switch, Select,DatePicker,InputNumber,Icon } from 'antd';
const FormItem = Form.Item;

import { DAILY_TYPE } from '../constants';
import DailyItem from './dailyItem';
const modulePrefix = 'm-daily-modal';

const FormLayout = { labelCol: { span: 3 }, wrapperCol: { span: 13, offset: 0 } };

class DailyModal extends Component{

  static propTypes = {
    edit: PropTypes.bool,
    visible: PropTypes.bool,
    onCreate: PropTypes.func,
    onCancel: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state={
      detail:{
        "type":0,
        "accountId" : 0,
        "date":"2019-02-01",
        "createTime" :new Date().getTime(),
        "editTime" : new Date().getTime(),
        "creatorId" : 0,
        "creator" : "admin",
        "sumMoney" : 0,
        "content" : "无",
        items:[
         {
            "id":1,
            "money" : 0,
            "time" : 0,
            "place" : "",
            "persons" : "",
            "content" : "",
            "type" : 0,
            "level" : 2,
            _edit:1
          }
        ]
      }
      
    }
  }
  detailDateChange=(moment)=>{
    console.log(moment._d.getTime());
    this.state.detail.date=moment._d.getTime();
  }
  onSave=()=>{
    //console.log(this.itemForm.props.form);
   // console.log(this.itemForm.props.form.getFieldsValue());
    console.log(this.state.detail);
    this.props.handleCreate(JSON.stringify(this.state.detail));
  }

  handleSaveItem=(data)=>{
     let crtEdit=this.state.detail.items.find((a)=>a._edit==1);
     if(crtEdit){
      crtEdit=Object.assign(crtEdit,data);
      crtEdit._edit=0;
      console.log(crtEdit);
      this.setState({
        detail:this.state.detail
      });
     }
  }

  handleCancelItem=(item)=>{
    this.editItem(item,false);
  }
  newItem=()=>{
    this.state.detail.items.map((crt)=>{
      crt._edit=0;
    });
    this.state.detail.items.unshift({
      "id":new Date().getTime(),
      "money" : 0,
      "time" : 0,
      "place" : "",
      "persons" : "",
      "content" : "",
      "type" : 0,
      "level" : 0,
      _edit:1
    });
    this.setState({
      detail:this.state.detail
    });
  }
  editItem=(item,setval)=>{
     this.state.detail.items.map((crt)=>{
       crt._edit=0;
       if(item.id==crt.id){
        crt._edit=setval==undefined?1:setval;
       }
     });console.log(this.state.detail);
     this.setState({
      detail:this.state.detail
    });
  }

  delItem=(index)=>{
     this.state.detail.items.splice(index,1);
     this.setState({
      detail:this.state.detail
    });
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const {hideModal, visible, edit } = this.props;
    const {detail}=this.state;
    return (
      <Modal
        className={modulePrefix}
        title={(edit ? '编辑': '新增')}
        width={760}
        visible={visible}
        onClose={hideModal}
        footer={
        <div>
          <Button key="back" onClick={hideModal} className="u-btn-normal" size="large">取消</Button>
          <Button key="submit" onClick={this.onSave} className="u-btn-normal" type="primary" size="large">确定</Button>
        </div>
        }
      >
       
        <Form>
          <FormItem label="日期" {...FormLayout}>
            {getFieldDecorator('date', {
              rules: [{ 
                required: true
                }]
            })(
              <DatePicker initialValue={detail.date} onChange={this.detailDateChange} />
            )}
          </FormItem>
          <FormItem label="类型" className="form-item-type"
                  {...FormLayout}
              >
                {getFieldDecorator('type', {
                  rules: [
                    { required: true, message: '请选择类型' },
                  ],initialValue:detail.type
                })(
                  <Select  
                    placeholder="请选择类型">
                    {DAILY_TYPE.map(item => <Select.Option value={item.key} key={item.key}>{item.label}</Select.Option>)}
                  </Select>
                )}
            </FormItem>
        </Form>
        <hr/>
        <div className="icon-new-wraper">
        <span className="icon-new" onClick={this.newItem}><Icon type="plus-circle" />新增明细</span>
        </div>
        {detail.items.map((item,index) =>
        item._edit?
        <DailyItem handleSaveItem={this.handleSaveItem} handleCancelItem={this.handleCancelItem} key={item.id} item={item} wrappedComponentRef={(form) => this.itemForm = form} />:<div key={item.id}>
          <div className="items-show">
          <span className="links">
          <a onClick={()=>{this.editItem(item);}}>编辑</a>
          <a onClick={()=>{this.delItem(index);}}>删除</a>
          </span>
          <div className="item-show">
            <dl><dt>金额：</dt><dd>{item.money}</dd></dl>
            <dl><dt>时间：</dt><dd>{item.time}</dd></dl>
          </div>
          <div className="item-show">
            <dl><dt>地点：</dt><dd>{item.place}</dd></dl>
            <dl><dt>人物：</dt><dd>{item.persons}</dd></dl>
          </div>
          <div className="item-show">
            <dl><dt>内容：</dt><dd>{item.content}</dd></dl>
          </div>
          <div className="item-show">
          <dl><dt>分类：</dt><dd>{item.type}</dd></dl>
          <dl><dt>重要程度：</dt><dd>{item.level}</dd></dl>
          </div>
          </div>
        </div>)}
       
      </Modal>
    );
  }
}

const WrappedForm = Form.create({
  onFieldsChange(props, changedFields) {
    //props.onChange(changedFields);
  },
  mapPropsToFields(props) {
    return {
      
    };
  }
})(DailyModal);
export default WrappedForm;
