# EditCategoryModal 级联分类编辑组件

用于知识库问题分类编辑

## 用在何处

- 机器人-知识库-问题-五级分类编辑
- 机器人-知识库-知识点-五级分类编辑
- 机器人-知识库-寒暄库-五级分类编辑
- 运营后台-云知识库管理-问题五级分类编辑
- 运营后台-云知识库管理-行业两级分类编辑

## 基本使用

:::demo 级联分类编辑组件

```js
  let updateTime = 1548745048151;
  const ajaxData = {
      data: [{
        name: "消费者", 
        id: 588830, 
        cloud: true, 
        children: [{
            cloud: true,
            id: 588831,
            name: "售前",
            children: [{
                cloud: true,
                id: 588833,
                name: "售前商品咨询",
                children: [{
                    cloud: true,
                    id: 588834,
                    name: "商品信息咨询",
                    children: [{
                        children: null,
                        cloud: true,
                        id: 588835,
                        name: "商品有无"
                    },{
                        children: null,
                        cloud: true,
                        id: 588837,
                        name: "商品功效"
                    }]
                }] 
            },{
                cloud: true,
                id: 588853,
                name: "页面问题",
                children: [{
                    children: null,
                    cloud: true,
                    id: 588854,
                    name: "已有信息咨询"
                },{
                    cloud: true,
                    id: 588861,
                    name: "页面信息错误",
                    children: [{
                        children: null,
                        cloud: true,
                        id: 588862,
                        name: "产地错误"
                    },{
                        children: null,
                        cloud: true,
                        id: 588864,
                        name: "上下页面不一致"
                    }] 
                }]
            }]
        },{
            cloud: true,
            id: 589392,
            name: "活动",
            children: [{
                cloud: true,
                id: 589393,
                name: "日常活动",
                children: null
            },{
                cloud: true,
                id: 589415,
                name: "实时活动更新",
                children: null
            }]
        }]
    },{
        children: null,
        cloud: false,
        id: 582636,
        name: "业务"   
    }],
    time: updateTime
  };

  class App extends React.Component{
  
    constructor(props){
        super(props);
        this.state = {
            showCategoryModal: false,
            editCategoryData: '',
            time: ''
        }
    };

    //控制浮层显隐
    toggleCategoryModal = () => {
        this.setState({showCategoryModal: !this.state.showCategoryModal},() => {
            if(!this.state.showCategoryModal) {
                //关闭浮层以后页面重新拉取分类数据
            } else {
                //模拟打开浮层 组件内发送请求获取数据
                this.setState({editCategoryData: ajaxData.data, time: ajaxData.time}); 
            }
        });
    };

    render() {
        const {showCategoryModal, editCategoryData, time} = this.state;
        return (
            <div className="component-demo">
                <span className="category-edit" onClick={this.toggleCategoryModal}>点击编辑分类</span>
                {showCategoryModal && 
                    <EditCategoryModal
                        showCategoryModal={showCategoryModal}
                        toggleCategoryModal={this.toggleCategoryModal}
                        editCategoryData={editCategoryData}
                        time={time}
                        resetData={() => {}}
                        setEditCategoryData={() => {
                            //模拟保存成功后重新请求获取数据
                            updateTime = ++updateTime;
                            this.setState({editCategoryData: ajaxData.data, time: updateTime});
                        }}
                    />
                }
            </div>
        );
    }
  }
  ReactDOM.render(<App/>, mountNode);


//实际使用时，可将EditCategoryModal组件进行如下包裹
const mapStateToProps = (state) => {
  return {
    currentRobot: state.currentRobot,
    ...state.Questions.Ques
  };
};

const mapDispatchToProps = (dispatch) => {
  return Object.assign({}, bindActionCreators({
    getEditCategoryData,
    resetData,
    setEditCategoryData
  }, dispatch));
};
```

```less
.component-demo {
    text-align: center;
}
.category-edit {
    cursor: pointer;
    color: #337eff;
}
```

:::


## API

| 属性                 | 说明                               | 类型     | 默认值  |
| ------------------- | ---------------------------------- | ------- | ------ |
| showCategoryModal   | 控制浮层显隐                         | Boolean | -      |
| title               | 浮层展示Title                       | String | '编辑知识库分类' |
| max_level           | 分类层级                            | Number | 5 |
| max_Input           | 分类名长度限制                       | Number | 50 |
| getEditCategoryData | 打开浮层/更新浮层时调用该函数获取分类数据 | (robotId: Number) => void | - |
| setEditCategoryData | 更新浮层时调用该函数保存数据            | (options: Object) => void | - |
| resetData           | 关闭浮层后调用该函数清空分类数据        | () => void | - |

