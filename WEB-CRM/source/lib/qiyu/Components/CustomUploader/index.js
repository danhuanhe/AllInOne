import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { Icon, Upload, Spin, Button } from 'ppfish';
import { request } from '../../utils';
import './index.less';

/**
 * 上传组件
 * - 已插槽的形式传入上传按钮
 * - 支持 Upload 同名属性
 * @prop onChange   {func}  上传文件状态发生变化的回调函数  参数为 errorMesg url nosFileName fileList
 */
const DEFAULT_BUTTON = <Button type="primary"><Icon type="upload-line" />上传</Button>;
class CustomUploader extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.object,
    initialValue: PropTypes.array,
    handleRemove: PropTypes.func,
    fileType: PropTypes.string.isRequired,
    maxFileSize: PropTypes.number.isRequired,
    maxFileNumber: PropTypes.number,
    fromSupervisor: PropTypes.bool,
  };
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      fileList: props.initialValue && props.initialValue[0] && props.initialValue[0].name ? props.initialValue : [],
      loading: false,
      data: null,   // 上传所需参数
      action: null, // 上传地址
    };
  }

  handleChange = (info) => {
    let fileList = info.fileList;
    if(this.props.maxFileNumber > 0) {
      fileList = fileList.slice(-Math.abs(this.props.maxFileNumber));
    }
    
    if (info.file.status === 'uploading') {
      this.setState({ 
        loading: true,
        fileList: fileList
      });
      return;
    }
    
    if (info.file.status === 'done') {
      this.setState({ 
        loading: false,
        fileList: fileList
      });
      this.props.onChange({
        errorMesg: '',
        url: info.file.response.url,
        nosFileName: this.state.data.Object,
        name: info.file.name,
        size: info.file.size,
        fileList: fileList
      });
    }

    if (info.file.status === 'removed' ) {
      this.setState({ 
        loading: false,
        fileList: fileList
      });
      this.props.onChange({
        errorMesg: '',
        url: info.file.url,
        nosFileName: '',
        name: info.file.name,
        size: info.file.size,
        fileList: fileList
      });
    }
  };

  // 向nos申请token
  getNosToken = (file) => {
    if(this.props.fromSupervisor) { //运营后台上传
      return request({
        url: '/supervisor/api/upload/getNosToken',
        method: 'POST',
        data: {
          key: file.name
        }
      });
    } else { 
      return request({
        url: '/api/upload/getNosToken',
        params: {
          fileName: file.name
        }
      });
    }
  };

  // 上传前校验格式
  beforeUpload = (file) =>{
    // nos要求每次都重新获取token
    return this.getNosToken(file)
      .then(({result}) => {
        // 校验类型
        const isValidType = this.props.fileType.includes(file.type);
        // 按理说逻辑不会到达这里
        if (!isValidType) {
          this.setState({ loading: false });
          this.props.onChange({
            errorMesg: `仅支持${this.props.fileType}格式`,
            url: '',
            nosFileName: '',
          });
          throw new Error(`仅支持${this.props.fileType}格式`);
        }
        // 校验大小
        const isValidSize = file.size / 1024 / 1024 < this.props.maxFileSize;
        if (!isValidSize) {
          this.setState({ loading: false });
          this.props.onChange({
            errorMesg: `文件大小不能超过${this.props.maxFileSize}M`,
            url: '',
            nosFileName: '',
          });
          throw new Error(`文件大小不能超过${this.props.maxFileSize}M`);
        }
        const {fileName, bucket, token} = result;
        // 上传地址
        const action = `https://nos.netease.com/${bucket}`;
        this.setState({
          action,
          data: {
            'Object': fileName,
            'x-nos-token': token,
            'file': file
          }
        });
        return true;
      });
  };

  getItems() {
    return Children.map(this.props.children, (child, index) => {
      return React.cloneElement(child);
    });
  }

  render() {
    const { onChange, ...others } = this.props; //
    const { loading, action, data} = this.state;
    const loadingBtn = (
      <div>
        <Spin />
        <div className="fishd-upload-text">上传</div>
      </div>
    );
    return (
      <Upload
        accept={this.props.fileType}
        name="file"
        className="cus-uploader"
        action={action}
        data={data}
        beforeUpload={this.beforeUpload}
        onChange={this.handleChange}
        onRemove={this.props.handleRemove}
        fileList={this.state.fileList}
        {...others}
      >
       {loading ? loadingBtn : this.getItems() || DEFAULT_BUTTON}
      </Upload>
    );
  }

}

export default CustomUploader;
