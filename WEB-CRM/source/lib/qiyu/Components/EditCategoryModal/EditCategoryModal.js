import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Modal, Input, Button, Tooltip} from 'ppfish';
import classNames from 'classnames';

import {getCategoryLevels, updateCategoryLevels, addCategoryLevel} from './utils';
import './EditCategoryModal.less';

const modulePrefix = 'm-EditCategory';

class EditCategoryModal extends Component {

  static propTypes = {
    currentRobot: PropTypes.object,
    showCategoryModal: PropTypes.bool,
    toggleCategoryModal: PropTypes.func,
    getEditCategoryData: PropTypes.func,
    setEditCategoryData: PropTypes.func,
    editCategoryData: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
    ]),
    time: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    resetData: PropTypes.func,
    title: PropTypes.string
  };

  static defaultProps = {
    title: '编辑知识库分类',
    max_level: 5,
    max_Input: 50
  };

  constructor(props) {
    super(props);
    this.state = {
      editCategoryData: '',
      levels: '',                                   //[{name:'一级分类',index:-1,itm:{id:0,children:[]}},{name:'二级分类',index:-1,itm:null}] index是该层级选择的项排位
      root: null,                                   //五级分类的信息
      _root: '',                                    //root的JSON字符串，用于比较分类是否被修改过
      changed_index: -1,                            //被修改过的层级索引
      buttonEnabled: [],                            //保存按钮状态 true-可保存 false-不可保存
      levelEnabled: [true,true,true,true,true],     //当某一层级有改动时，其它层级要变成不可操作 true-可修改 false-不可修改
      adding: [],                                   //正在添加分类项 true-添加分类项
      addValue: '',                                 //添加分类项值
      editValue: '',                                //编辑的值
      errorStatus: '',                              //错误提示
      time: '',                                     //更新时间
      loading: []                                   //保存中
    };
    //请求数据
    const {currentRobot, getEditCategoryData} = props;
    if(props.showCategoryModal && !Array.isArray(props.editCategoryData)) {
      if(getEditCategoryData) {
        if(currentRobot) {  //管理端-知识库
          getEditCategoryData({robotId: currentRobot.robotId || -1});
        } else {  //运营后台-云知识库管理
          getEditCategoryData();
        }
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if(Array.isArray(nextProps.editCategoryData) && nextProps.time && !this.state.editCategoryData) {  //初次渲染
      const root = {
        id: 0,
        children: nextProps.editCategoryData
      };
      const _root = JSON.stringify(root);
      const time = nextProps.time;
      const editCategoryData = nextProps.editCategoryData;
      const levels = getCategoryLevels(root);   //根据当前数据计算有几级，然后渲染页面
      this.setState({root, _root, time, levels, editCategoryData}, () => {
        this.onSelectItem(0,0);  //默认选择第一级第一个(索引，层级）
      });
    }
    if(nextProps.time && this.state.time && nextProps.time != this.state.time) { //二次渲染，保存数据之后的渲染
      const root = {
        id: 0,
        children: nextProps.editCategoryData
      };
      const _root = JSON.stringify(root);
      const time = nextProps.time;
      const editCategoryData = nextProps.editCategoryData;

      const levels = updateCategoryLevels(this.state.levels, root);
      const buttonEnabled = []; //保存成功后参数还原
      const levelEnabled = [true,true,true,true,true]; //保存成功后参数还原
      const loading = [];
      this.setState({root, _root, time, levels, editCategoryData, buttonEnabled, levelEnabled, loading});
    }
  }

  /**
   * 关闭浮层
   */
  closeModal = () => {
    const {resetData, toggleCategoryModal} = this.props;
    const state = {  // 组件状态全部还原
      editCategoryData: '',
      levels: '',
      root: null,
      _root: '',
      changed_index: -1,
      levelEnabled: [true,true,true,true,true],
      buttonEnabled: [],
      adding: [],
      addValue: '',
      editValue: '',
      errorStatus: '',
      time: ''
    };
    this.setState({...state});
    resetData();
    toggleCategoryModal();
  };

  /**
   * 节点选择函数
   * @param index 当前的索引
   * @param level 当前选择的层级
   */
  onSelectItem = (index, level) => {
    const {levels, root} = this.state;
    levels[level].index = index;  //每一层级选中项索引
    for (let i = level + 1; i < levels.length; i++) {
      levels[i].index = 0;
    }
    const updateLevels = updateCategoryLevels(levels, root);
    this.setState({levels: updateLevels});
  };

  /**
   * 判断数据是否有修改
   * @param level 层级
   */
  onChange = (level) => {
    const {_root, root, adding, buttonEnabled} = this.state;
    let {levelEnabled} = this.state;
    let changed_index = -1;
    if (_root == JSON.stringify(root)) {
      this.addingStatus(adding) ? changed_index = level : changed_index = -1;
      buttonEnabled[level] = false;
      levelEnabled = levelEnabled.map(() => {return true;});
    } else {
      changed_index = level;
      buttonEnabled[level] = true;
      levelEnabled = levelEnabled.map((item,index) => {return index==level;});
    }
    this.setState({changed_index, buttonEnabled, levelEnabled});
  };


  /**
   * 置顶操作
   * @param e
   * @param levelInfo
   * @param level
   * @param index
   */
  sortTop = (e, levelInfo, level, index) => {
    e.stopPropagation();
    const {itm, index:selectedIndex} = levelInfo;
    if(!itm.children || !itm.children.length) return;

    const {levels} = this.state;
    let curItem = levels[level]['itm']['children'][index];
    levels[level]['itm']['children'].splice(index,1);
    levels[level]['itm']['children'].unshift(curItem);

    this.onChange(level);
    this.setState({levels},() => {  //位置变动后，默认选择项要跟变化前保持一致
      if(selectedIndex == index) {
        this.onSelectItem(0,level);
      } else if(selectedIndex < index) {
        this.onSelectItem(selectedIndex+1,level);
      }
    });
  };

  /**
   * 上移操作
   * @param e
   * @param levelInfo   该层级所有数据{name:'一级分类',index:-1,itm:{id:0,children:[]}
   * @param level 层级
   * @param index 排位
   */
  sortUp = (e, levelInfo, level, index) => {
    e.stopPropagation();
    const {itm, index:selectedIndex} = levelInfo;
    if(index==0 || !itm.children || !itm.children.length || !itm.children[index-1]) return;

    const {levels} = this.state;
    let prevItem = levels[level]['itm']['children'][index-1];
    let curItem = levels[level]['itm']['children'][index];
    levels[level]['itm']['children'][index-1] = curItem;
    levels[level]['itm']['children'][index] = prevItem;

    this.onChange(level);
    this.setState({levels},() => {  //位置变动后，默认选择项要跟变化前保持一致
      if(selectedIndex == index) {
        this.onSelectItem(index-1,level);
      } else if(selectedIndex == index-1) {
        this.onSelectItem(selectedIndex+1,level);
      }
    });
  };

  /**
   * 下移操作
   * @param e
   * @param levelInfo
   * @param level 层级
   * @param index 排位
   */
  sortDown = (e, levelInfo, level, index) => {
    e.stopPropagation();
    const {itm, index:selectedIndex} = levelInfo;
    if(index==itm.children.length-1 || !itm.children || !itm.children.length || !itm.children[index+1]) return;

    const {levels} = this.state;
    let nextItem = levels[level]['itm']['children'][index+1];
    let curItem = levels[level]['itm']['children'][index];
    levels[level]['itm']['children'][index+1] = curItem;
    levels[level]['itm']['children'][index] = nextItem;

    this.onChange(level);
    this.setState({levels},() => {  //位置变动后，默认选择项要跟变化前保持一致
      if(selectedIndex == index) {
        this.onSelectItem(index+1,level);
      } else if(selectedIndex == index+1) {
        this.onSelectItem(selectedIndex-1,level);
      }
    });
  };

  /**
   * 开始新增分类项
   * @param e
   * @param levelInfo
   * @param level
   */
  beginAdd = (e, levelInfo, level) => {
    e.stopPropagation();
    const {itm} = levelInfo;
    let {adding, levelEnabled} = this.state;
    if(!itm || adding[level] || !levelEnabled[level]) return;
    adding[level] = true;  //添加项状态
    this.setState({adding, errorStatus: ''}, () => {
      this.refs['addInput'].focus();
    });
  };

  /**
   * 结束新增分类项
   * @param e
   * @param levelInfo
   * @param level
   */
  endAdd = (e,levelInfo,level) => {
    let {addValue, errorStatus} = this.state;
    const {max_Input} = this.props;

    const {itm} = levelInfo;
    let value = addValue.trim();

    if (!value) {
      errorStatus = '该类别为空';
    } else if(value.length > max_Input) {
      errorStatus = `参数不合法，最多输入${max_Input}个字符`;
    } else if(this.checkRepeat(value, levelInfo, -1)) {
      errorStatus = '该类别已存在';
    } else {
      errorStatus = '';  //清空errorStatus状态
      itm.children = itm.children || [];
      itm.children.push({ name: value });

      this.cancelAdd(level);
      if (itm.children.length === 1)
        this.onSelectItem(0, level);
    }
    this.setState({errorStatus});
  };

  /**
   * 检查新增项是否与已存在项重名
   * @param value
   * @param levelInfo
   * @param i 编辑的节点排位
   * @returns {boolean}
   */
  checkRepeat = (value, levelInfo, i) => {
    if(!levelInfo.itm.children) return false;
    return levelInfo.itm.children.some((item, index) => {
      return i != index && value == item['name'];
    });
  };

  /**
   * 取消添加项状态
   * @param level
   * @param callback
   */
  cancelAdd = (level, callback) => {
    let {adding} = this.state;
    adding[level] = false;  //添加项状态取消
    this.setState({adding},() => {
      if(!callback) {
        this.onChange(level);
      } else {
        callback();   //取消正在编辑的项并直接发送请求
      }
    });
  };

  /**
   * 开始编辑
   * @param e
   * @param levelInfo
   * @param level
   * @param index
   * @param item
   */
  beginEdit = (e, levelInfo, level, index, item) => {
    e.stopPropagation();
    if(item.cloud || item.disabled) return;  //行业云类目不允许编辑

    let {levels, levelEnabled} = this.state;
    levels[level]['itm']['children'][index]['edit'] = true;
    let editValue = levels[level]['itm']['children'][index]['name'];        //编辑的初始值
    levelEnabled = levelEnabled.map((item,index) => {return index==level;}); //编辑时，只有所在层级可以添加分类项
    this.setState({levels, editValue, levelEnabled, errorStatus: ''},() => {
      this.refs['editInput'].focus();
    });
  };

  /**
   * 编辑分类项完成
   * @param e
   * @param levelInfo
   * @param level
   * @param index
   */
  endEdit = (e, levelInfo, level, index) => {
    e.stopPropagation();

    let {errorStatus, levels, editValue} = this.state;
    const {max_Input} = this.props;
    const {itm} = levelInfo;
    let value = editValue.trim();

    if (!value) {
      errorStatus = '该类别为空';
    } else if(value.length > max_Input) {
      errorStatus = `参数不合法，最多输入${max_Input}个字符`;
    } else if(this.checkRepeat(value, levelInfo, index)) {
      errorStatus = '该类别已存在';
    } else {
      errorStatus = '';
      levels[level]['itm']['children'][index]['edit'] = false; //退出编辑状态
      levels[level]['itm']['children'][index]['name'] = value; //给节点赋予新值
    }
    this.setState({errorStatus, levels}, () => {
      const {levels, errorStatus} = this.state;
      if(!errorStatus) {
        delete levels[level]['itm']['children'][index]['edit'];
        this.onChange(level);
      }
    });
  };

  /**
   * 取消编辑
   * @param e
   * @param levelInfo
   * @param level
   * @param index
   */
  cancelEdit = (e,levelInfo,level,index) => {
    e.stopPropagation();

    let {levels} = this.state;
    levels[level]['itm']['children'][index]['edit'] = false; //退出编辑状态
    this.setState({levels},() => {
      const {levels} = this.state;
      delete levels[level]['itm']['children'][index]['edit'];
      this.onChange(level);
    });
  };

  /**
   * 修改正在编辑的分类项
   * @param e
   */
  editValue = (e) => {
    let editValue = e.target.value;
    this.setState({editValue});
  };

  /**
   * 删除分类项
   * @param e
   * @param levelInfo
   * @param level
   * @param index
   * @param item
   */
  deleteItem = (e,levelInfo,level,index,item) => {
    e.stopPropagation();

    if(item.disabled) return;  //云知识库管理已发布行业不允许删除

    const that = this;
    Modal.confirm({
      title: '您确认要删除该类别及以下的所有内容么，一旦删除无法恢复',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        levelInfo.itm['children'].splice(index,1);
        if(!levelInfo.itm['children'].length) levelInfo.itm['children'] = null;

        if(index == levelInfo.index) {  //如果删除的是当前选中的节点，默认无选中节点
          let {levels, root} = that.state;
          levels[level]['index'] = -1;
          levels = updateCategoryLevels(levels, root);
          that.setState({levels});
        } else {
          let {levels} = that.state;
          that.setState({levels});
        }
        that.onChange(level);
      }
    });
  };

  /**
   * 有任一项处于新增，所有添加分类项都要置灰
   * @param adding
   */
  addingStatus = (adding) => {
    return adding.some(item => {
      return !!item;
    });
  };

  /**
   * 保存
   * @param e
   * @param levelInfo 层级信息
   * @param index 层级
   */
  doSave = (e,levelInfo,index) => {
    e.stopPropagation();

    const {adding} = this.state;
    let that = this;
    let loading = [];
    if(this.addingStatus(adding)) {  //当前还有正在编辑项
      Modal.confirm({
        title: '当前仍有还在编辑的分类项，保存后已编辑内容不会生效，是否确认？',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          loading[index] = true;
          that.setState({loading});
          that.cancelAdd(index, () => {    //取消当前层级的编辑态
            that.doSaveImpl(levelInfo, index);
          });
        }
      });
    } else {
      loading[index] = true;
      this.setState({loading});
      this.doSaveImpl(levelInfo, index);
    }
  };

  doSaveImpl = (levelInfo, index) => {
    const {time, currentRobot, setEditCategoryData} = this.props;
    let options = {
      data: {
        id: levelInfo.itm.id,
        list: levelInfo.itm.children || [],
        time: time,
        robotId: currentRobot ? currentRobot.robotId || -1 : null
      },
      sucCallback: () => {
        let changed_index = -1;
      },
      failCallback: () => {
        let changed_index = -1;
      }
    };
    setEditCategoryData(options);
  };

  /**
   * 渲染知识库问题五级分类
   * @param levelInfo 层级信息
   * @param level 层级
   */
  renderLevel = (levelInfo, level) => {
    const {levelEnabled, adding, errorStatus, editValue} = this.state;
    const {itm} = levelInfo;
    return(
      <div>
        {itm && itm.children &&
        itm.children.map((item, index) => {
          return (
            <div key={index}>
              {item.edit ?
                <div
                  key={item.id}
                  className={`${modulePrefix}-item item-${level}-${index} ${levelInfo.index==index?'selected':''} ${levelEnabled[level] && !this.addingStatus(adding)?'':'disabled'}`}
                  onClick={() => this.onSelectItem(index,level)}
                >
                  <Tooltip
                    title={errorStatus}
                    placement="bottom"
                    getPopupContainer={triggerNode => document.getElementsByClassName(`item-${level}-${index}`)[0]}
                    visible={!!errorStatus}
                    autoAdjustOverflow={false}
                    overlayClassName={`${modulePrefix}-item-popover`}
                    overlayStyle={{maxWidth:'130px'}}
                    arrowPointAtCenter
                  >
                    <input autoComplete="off" value={editValue} onChange={(e) => this.editValue(e)} ref="editInput"/>
                  </Tooltip>
                  <i className="iconfont icon-correct1" title="确定" onClick={(e) => this.endEdit(e,levelInfo,level,index)}/>
                  <i className="iconfont icon-cancel" title="取消" onClick={(e) => this.cancelEdit(e,levelInfo,level,index)}/>
                </div>
                :
                <div
                  key={item.id}
                  className={`${modulePrefix}-item item-${level}-${index} ${levelInfo.index==index?'selected':''} ${levelEnabled[level] && !this.addingStatus(adding)?'':'disabled'}`}
                  onClick={() => this.onSelectItem(index,level)}
                >
                  <span>{item.name}</span>
                  <div className={`${modulePrefix}-actions`}>
                    {index > 0 && <i className="iconfont icon-sort-top" title="置顶" onClick={(e) => this.sortTop(e,levelInfo,level,index)}/>}
                    {index > 0 && <i className="iconfont icon-sort-up" title="上移" onClick={(e) => this.sortUp(e,levelInfo,level,index)}/>}
                    {index < itm.children.length-1 && <i className="iconfont icon-sort-down" title="下移" onClick={(e) => this.sortDown(e,levelInfo,level,index)}/>}
                    <Tooltip
                      title={item.cloud?'行业云知识库类目不支持修改':null}
                      placement="bottomRight"
                      overlayStyle={{width:'130px'}}
                      autoAdjustOverflow={false}
                      getPopupContainer={triggerNode => document.getElementsByClassName(`item-${level}-${index}`)[0]}
                      arrowPointAtCenter
                    >
                      <i 
                        title="编辑"
                        className={classNames('iconfont icon-edit',{
                          'disabled': item.cloud || item.disabled,
                        })} 
                        onClick={(e) => this.beginEdit(e,levelInfo,level,index,item)}
                      />
                    </Tooltip>
                    <i 
                      title="删除"  
                      className={classNames('iconfont icon-delete',{
                          'disabled': item.disabled,
                      })} 
                      onClick={(e) => this.deleteItem(e,levelInfo,level,index,item)}
                    />
                  </div>
                </div>}
            </div>);
        })}

        {adding[level] &&
        <div className={`${modulePrefix}-item item-${level} input`}>
          <Tooltip
            title={errorStatus}
            placement="bottom"
            getPopupContainer={triggerNode => document.getElementsByClassName(`item-${level}`)[0]}
            visible={!!errorStatus}
            autoAdjustOverflow={false}
            overlayClassName={`${modulePrefix}-item-popover`}
            overlayStyle={{maxWidth:'130px'}}
            arrowPointAtCenter
          >
            <Input autoComplete="off" onBlur={(e) => this.setState({addValue:e.target.value})} ref="addInput" style={{fontSize:'12px'}}/>
          </Tooltip>
          <i className="iconfont icon-correct1" title="确定" onClick={(e) => this.endAdd(e,levelInfo,level)}/>
          <i className="iconfont icon-cancel" title="取消" onClick={() => this.cancelAdd(level)}/>
        </div>
        }

        <div className={`${modulePrefix}-add ${levelEnabled[level] && itm && !this.addingStatus(adding) ?'':'disabled'}`} onClick={(e) => this.beginAdd(e,levelInfo,level)}>
          <i className="iconfont icon-jia"/>
          <span>添加分类项</span>
        </div>
      </div>
    );
  };

  /**
   * 添加新的一级
   */
  addLevel = () => {
    //找到最后一个面板的选中项目
    const {levels} = this.state;
    let last = levels.length - 1,
      lastLevelIndex = levels[last].index,
      itm = levels[last].itm && levels[last].itm.children && levels[last].itm.children[lastLevelIndex];
    addCategoryLevel(levels, itm);
    this.setState({levels});
  };

  render() {
    const {showCategoryModal, title, max_level} = this.props;
    const {levels, buttonEnabled, loading} = this.state;
    let len, addLen;
    if(Array.isArray(levels)) {
      len = levels.length;
      if(levels.length < max_level) {
        addLen = 130;
      } else {
        addLen = 0;
      }
    } else {
      len = 0;
      addLen = 130;
    }

    return (
      <Modal
        visible={showCategoryModal}
        title={title}
        width={175*len+addLen+100}
        bodyStyle={{padding:'30px 50px',display:'flex'}}
        maskClosable={false}
        onCancel={this.closeModal}
        footer={null}
        destroyOnClose
      >
        <div className={modulePrefix}>
          {levels && levels.map((level,index) => {
            return(
              <div className={`${modulePrefix}-level`} key={index}>
                <div className={`${modulePrefix}-name`}>{level.name}</div>
                <div className={`${modulePrefix}-items`}>{this.renderLevel(level,index)}</div>
                <div className={`${modulePrefix}-save`}>
                  <Button
                    loading = {loading[index]}
                    disabled={!buttonEnabled[index]}
                    onClick={(e) => {this.doSave(e,level,index);}}
                  >
                    {loading[index] ? '保存中' : '保存'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        {levels.length < max_level &&
        <div className={`${modulePrefix}-addLevel`} onClick={this.addLevel}>
          <i className="iconfont icon-jia"/>新增下一级分类
        </div>
        }
      </Modal>
    );
  }
}

export default EditCategoryModal;

