import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Tag, Modal, message, Form, Ellipsis, Button, Spin} from 'ppfish';
import classNames from 'classnames';
import './index.less';

const formItemLayout = {
  labelCol: {span: 8},
  wrapperCol: {span: 16},
};
// tag 最大个数
const maxTagLength = 20;
// tag 最大长度
const maxTagWidth = 115;

const noop = () => {
};

/**
 * 用户标签组件
 * 外层去做数据初始化，获取userTags和allTags
 *
 * @params addUserTag {Function} 添加标签方法
 * @params delUserTag {Function} 删除标签方法
 * @params allTags {Array} 全量标签
 * @params userTags {Array} 用户选中标签
 * @params sessionId {Number|String} 会话ID
 * @params tagAddLoading {Boolean} 标签添加模态框加载中状态
 * @params tagLoading {Boolean} 标签加载中状态
 * @params user {Object} 会话中的用户信息
 */
export default class UserTags extends Component {

  static propTypes = {
    addUserTag: PropTypes.func,
    allTags: PropTypes.array,
    delUserTag: PropTypes.func,
    sessionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    tagAddLoading: PropTypes.bool,
    tagLoading: PropTypes.bool,
    user: PropTypes.object,
    userTags: PropTypes.array,
  };

  static defaultProps = {
    addUserTag: noop,
    allTags: [],
    delUserTag: noop,
    userTags: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      selectedList: [],
    };
  }

  onClose = (e, tag) => {
    e.preventDefault();
    const confirm = Modal.confirm;
    const {delUserTag, user, sessionId} = this.props;
    if (!user.crmId && !user.id) {
      message.warning("删除标签时，缺少必要的参数");
      return;
    }
    const form = {
      tagId: tag.tagCustomId,
    };
    if (user.crmId) {
      form.crmId = user.crmId;
    }
    if (user.id) {
      form.userId = user.id;
    }
    confirm({
      title: `是否确认删除当前客户的标签"${tag.name}"?`,
      onOk() {
        delUserTag(form, sessionId);
      }
    });
  };

  showAddModal = () => {
    this.setState({
      modalVisible: true
    });
  };

  handleOk = () => {
    const {selectedList} = this.state;
    if (selectedList.length < 1) return;
    if (selectedList.length > maxTagLength) {
      message.warning(`每个用户不能添加超过${maxTagLength}个标签$`);
      return;
    }
    const {user, userTags, addUserTag, sessionId} = this.props;
    const newUserTags = userTags.concat(this.state.selectedList);
    if (!user.crmId && !user.id) {
      message.warning("添加标签时，缺少必要的参数");
      return;
    }
    const form = {
      idList: newUserTags.map(tag => tag.tagCustomId),
    };
    if (user.crmId) {
      form.crmId = user.crmId;
    }
    if (user.id) {
      form.userId = user.id;
    }
    addUserTag(form, sessionId, newUserTags, () => {
      this.setState({
        modalVisible: false,
        selectedList: []
      });
    });
  };

  handleCancel = () => {
    this.setState({
      modalVisible: false,
      selectedList: []
    });
  };

  toggleTagSelect = (tag) => {
    const {selectedList} = this.state;
    const index = selectedList.findIndex(obj => obj.tagCustomId === tag.tagCustomId);
    if (index !== -1) {
      this.setState({
        selectedList: [
          ...selectedList.slice(0, index),
          ...selectedList.slice(index + 1)
        ]
      });
    } else {
      this.setState({
        selectedList: [
          ...selectedList,
          tag
        ]
      });
    }
  };

  render() {
    const {userTags, allTags, tagAddLoading, tagLoading} = this.props;
    const {modalVisible, selectedList} = this.state;
    const tagsInModal = allTags.filter(allTag => !userTags.find(userTag => allTag.tagCustomId === userTag.tagCustomId));
    const FormItem = Form.Item;
    return (
      <React.Fragment>
        {
          tagLoading ? <Spin.Container style={{height: 40}}><Spin/></Spin.Container> :
            <div className="u-user-tags">
              {
                userTags && userTags.map(tag => (
                  <Tag color={tag.color}
                       autoShowClose={false}
                       key={tag.tagCustomId}
                       closable
                       onClose={(e) => this.onClose(e, tag)}><Ellipsis width={maxTagWidth}>{tag.name}</Ellipsis></Tag>))
              }
              {tagsInModal && !!tagsInModal.length &&
              <i className="tag-add iconfont icon-plus-circlex" onClick={this.showAddModal}/>}
            </div>
        }
        <Modal
          title="添加标签"
          visible={modalVisible}
          onOk={this.handleOk}
          confirmLoading={tagAddLoading}
          onCancel={this.handleCancel}
          footer={
            <React.Fragment>
              <Button onClick={this.handleCancel}>取消</Button>
              <Button onClick={this.handleOk} disabled={!selectedList.length} type="primary">
                确定
              </Button>
            </React.Fragment>
          }
        >
          <Form>
            <FormItem label="选择标签" {...formItemLayout} required>
              <div className="tags-select-zone">
                {
                  tagsInModal.map(tag => (
                    <Tag color={tag.color} key={tag.tagCustomId} onClick={() => this.toggleTagSelect(tag)}
                         className={classNames({'tag-checked': selectedList.find(selectedTag => selectedTag.tagCustomId === tag.tagCustomId)})}
                    ><Ellipsis width={maxTagWidth}>{tag.name}</Ellipsis></Tag>))
                }
              </div>
            </FormItem>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}
