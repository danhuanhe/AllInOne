import React, { Component } from 'react';
import {Row,Col,Select} from 'ppfish';
import EditableText from '../EditableText';
import PropTypes from 'prop-types';

import './index.less';

class ApiCrmPanel extends Component{

    static propsTypes = {
      onChange: PropTypes.func,
      data: PropTypes.array
    };

    constructor(props){
        super(props);
    }


    handleChange = (item,value) => {
      let [{id,name}] = item.value.filter(({name}) => {return name == value});
      this.props.onChange ? this.props.onChange([{key: item.key, id, name}]) : null;
    };

  handleInputChange = (key,value) => {
    this.props.onChange ? this.props.onChange([{key,value}]) : null;
  };

    render(){
        const props = this.props;

        return(
            <div className="m-ApiCrmPanel">
                {
                  props.data ?
                  props.data.map(item => (
                      <Row key={item.index} className="ApiCrmPanel-row">
                          <Col span={8}>{item.label}</Col>
                          {
                              item.select ?
                              <Col span={16}>
                                  <Select style={{width: '100%'}} value={item.value.filter(({check}) => check==true)[0] ? item.value.filter(({check}) => check==true)[0].name : item.value[0].name}
                                  onChange={this.handleChange.bind(this,item)}>
                                      {item.value.map((it,inx) => (
                                          <Select.Option key={it.id} value={it.name}>{it.name}</Select.Option>
                                      ))}
                                  </Select>
                              </Col>
                              :
                              <Col span={16}>{item.href ? <a href={item.href} target="_blank">{item.value}</a> : <EditableText infoKey={item.key} text={item.value} canEdit={item.edit} onBlur={this.handleInputChange} />}</Col>
                          }
                      </Row>
                  )) :
                  <div className="ApiCrmPanel-tip">
                    <div className="ApiCrmPanel-img">
                      <img src="../../assets/image/crm_demo.png" alt="网易七鱼支持使用接口方式的CRM接入，用于安全地获取访客的信息"/>
                    </div>
                    <p>网易七鱼支持使用接口方式的CRM接入，用于安全地获取访客的信息&nbsp;<a
                      herf="https://qiyukf.com/docs/guide/crm/qiyu_crm_interface.html" target="_blank">了解详情<i
                      className="icon-dont u-icon-arrowright"></i></a></p>
                  </div>
                }
            </div>
        );
    }
}

export default ApiCrmPanel;
