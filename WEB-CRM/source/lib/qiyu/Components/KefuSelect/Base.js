
/**
 * 工作报表头部的选择客服组件
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import {TreeSelect} from 'ppfish';

/**
 * 所有展开过的节点的idValue记录在这里，若搜索结果里存在该节点的子节点，
 * 则不需要再对它的子节点进行耗时的排序、合并等操作
 */
const loadedNodesIdValue = [];

class Base extends Component {
  static propTypes = {
    /**
     * treeData的格式不需要专门构造，在reducer里使用下面提供的buildDefaultState
     * 和mergeTree函数即可返回满足格式的treeData
     */
    treeData: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      idValue: PropTypes.string.isRequired,
      type: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })).isRequired,
    loading: PropTypes.bool, // treeData的加载状态
    loadData: PropTypes.func.isRequired, // 展开某节点时的回调，需要返回一个Promise对象，告知数据加载完成/失败
    onSearch: PropTypes.func.isRequired, // 搜索时的回调，需要返回一个Promise对象，告知数据加载完成/失败
    onSearchDebounceTime: PropTypes.number, // onSearch函数触发的debounce时间
    getPopupContainer: PropTypes.func,

    // 其它ppfish的TreeSelec可接受的属性也可传进来
  }
  static defaultProps = {
    onSearchDebounceTime: 800,
    getPopupContainer: () => document.body
  }

  constructor(props) {
    super();
    this.onSearchDebounce = _.debounce(this.onSearch, props.onSearchDebounceTime);
  }

  state = {
    loading: false,
  }

  componentWillMount() {
    if (this.props.loading) {
      this.initializing = true;
    }
  }

  // shouldComponentUpdate(nextProps, nextStates) {
  //   if (nextStates.loading !== this.state.loading) {
  //     return true;
  //   }
  //   if (!this.initializing && this.props.loading !== nextProps.loading) {
  //     //目前只有初始化阶段时，props.loading的值会影响展现，避免其它时候多余的render
  //     return false;
  //   }

  //   return true;
  // }

  componentWillUpdate({loading}) {
    if (this.initializing && this.props.loading && !loading) {
      this.initializing = false;
    }
  }

  loadData = (treeNode) => {
    return new Promise((resolve, reject) => {
      const idValue = treeNode.props.idValue;
      this.props.loadData(idValue).then(() => {
        loadedNodesIdValue.push(idValue);
        resolve();
      }).catch(() => {
        reject();
      });
    });
  }

  onSearch = (val) => {
    if (!val) return;
    this.props.onSearch(val)
      .then(() => {
        this.setState({loading: false});
      })
      .catch(() => {
        this.setState({loading: false});
      });
  }

  onExpand = (value,extral) => {
    if (this.props.onExpand){
      this.props.onExpand(value,extral);
    }
  };


  render () {
    const {
      treeData,
      TreeSelectProps = {},
      onlyKefuGroup,
      showIcon = true,
      getPopupContainer,
      required = true,
      groupDisabled = false,
      style,
      dropdownStyle,
      ...others
    } = this.props;

    if (groupDisabled) {
      BFS(treeData[0], node => {
        if (node.type == 1) {
          node.disabled = true;
        }
        return false;
      });
    }

    const treeProps = {
      showSearch: true,
      editable: false,
      showIcon,
      treeData: this.initializing ? [{...treeData[0], children: undefined}] : treeData,
      treeDefaultExpandedKeys: ['0'],
      required,
      getPopupContainer: getPopupContainer,
      filterTreeNode: (val, {props}) => {
        return props.title.includes(val) || (props.pinyin && props.pinyin.includes(val));
      },
      style: {
        width: 150,
        ...style,
      },
      dropdownStyle: {
        width: 300,
        ...dropdownStyle
      },
      ...others,
      ...TreeSelectProps,
      loadData: this.loadData,
      onExpand: this.onExpand,
      onSearch: (value) => {
        if (value && !this.state.loading) this.setState({loading: true});
        else if (!value && this.state.loading) this.setState({loading: false});

        this.onSearchDebounce(value);
      },
      loading: this.state.loading,
    };

    return (
      <TreeSelect className={'m-KefuSelect'} {...treeProps} />
    );
  }
}


// 广度优先搜索
const BFS = (root, match) => {
  let queue = [root];
  while (queue.length) {
    let node = queue.shift();
    if (match(node)) return node;
    else if (node.children) {
      //queue = [...queue, ...node.children];
      // 这样效率高一点
      node.children.forEach(node => queue.push(node));
    }
  }
};

// 把每个节点的属性转换成 treeSelect 组件接受的属性
const converData = (nodesList, onlyKefuGroup = false) => nodesList.map(({id, name, parentId, isLeaf, isGroupLeaf, type, ...others}) => ({
  title: name,
  key: `${parentId}-${id}`,
  value: `${parentId}-${id}`, // treeselect组件要求value唯一
  idValue: `${id}`, // 自定义一个idValue属性，把它作为真正的value
  parentId: `${parentId}`,
  isLeaf: onlyKefuGroup ? (isGroupLeaf || isLeaf) : isLeaf, // 是否是叶子节点
  // isGroupLeaf,
  icon: type === 1 ? 
    <i className="iconfont icon-avatarGroup" style={{fontSize: '18px'}}/> :
    <i className="iconfont icon-avatar" style={{fontSize: '13px'}}/>,
  type,
  ...others
}));

const checkFirstLetterType = (str) => {
  //汉字
  if (/^[\u4e00-\u9fa5]/.test(str)) return 2;
  //数字、字母
  if (/^\w/.test(str)) return 1;
  //特殊符号
  return 0;
};

/**
 * 判断两个值的先后顺序
 * 返回值大于0：a在b之后
 * 返回值等于0：a在b之前
 * 返回值小于0：a和b在一起，先后位置任意
 */
const judgeOrder = (a, b) => {
  if (a.idValue == -1) return 1;
  if (b.idValue == -1) return -1;
  const aType = checkFirstLetterType(a.title.toLowerCase());
  const bType = checkFirstLetterType(b.title.toLowerCase());
  
  if (aType === bType) {
    const aPinyin = a.pinyin.toLowerCase();
    const bPinyin = b.pinyin.toLowerCase();
    if (aPinyin > bPinyin) return 1;
    if (aPinyin < bPinyin) return -1;
    return 0;
  }
  return aType - bType;
};

/**
 * 排序
 * 数字>大小写字母（按到 A-Z，不区分大小写）>汉字（首字母拼音A-Z）
 */
const sortNodes = nodes => nodes.sort(judgeOrder);

/**
 * 合并 nodes 到到某个节点的 children 里
 * 关于为什么要合并而不能直接覆盖(替换整个children)，考虑以下步骤：
 * 1、如果节点A的子节点A-A已经加载，A-A的子节点A-A-A也已加载（都是通过搜索加载），
 * 2、这时展开节点A，将A.children直接替换成异步加载到的A的全部子节点。导致节点A-A-A丢失，
 * 虽然它被选中与否的状态不会丢失(单独的数组保存)，之后还是可以通过展开得到A-A-A，对用户使用上来说似乎没有影响，
 * 但若此时A-A-A的状态是已选择，就可导致组件报错，因为当前树上没有该节点却有它被选中的状态。
 * 或2、搜索加载A-B，它也是A的子节点，同理此时同样不能直接替换。
 */
const mergeChildren = (parentNode, sortedNodesList) => {
  const curChildren = parentNode.children;
  if (!curChildren || curChildren.length < 1 || parentNode.key == 0) {
    //当前parentNode的children为空，直接赋值，无需合并
    parentNode.children = sortedNodesList;
  } else {
    //合并sortedNodesList到parentNode的children里
    let p1 = 0, p2 = 0;
    const resultChildren = [];
    //合并两个有序的且可能有重复值的数组(sortedNodesList中某个节点可能在curChildren中存在)
    while (p1 < curChildren.length && p2 < sortedNodesList.length) {
      let order = judgeOrder(curChildren[p1], sortedNodesList[p2]);
      if (order > 0) {
        resultChildren.push(sortedNodesList[p2]);
        p2++;
      } else if (order < 0) {
        resultChildren.push(curChildren[p1]);
        p1++;
      } else {
        if (curChildren[p1].idValue === sortedNodesList[p2].idValue) {
          //节点重复
          resultChildren.push(curChildren[p1]);
          p1++;
          p2++;
        } else {
          resultChildren.push(curChildren[p1]);
          resultChildren.push(curChildren[p2]);
          p1++;
          p2++;
        }
      }
    }
    sortedNodesList.forEach(rc => {
      if (!parentNode.children.find(c => c.idValue == rc.idValue)) parentNode.children.push(rc);
    });
  }
};

// 合并搜索结果到 tree 里
const mergeSearch = (root, nodesList) => {
  let resultMap = {};
  nodesList.forEach(n => {

    // 对于已经展开加载过的节点，不需要再合并搜索结果到其子节点中
    if (loadedNodesIdValue[n.parentId]) return;
    
    if (resultMap[n.parentId]) {
      resultMap[n.parentId].push(n);
    } else {
      resultMap[n.parentId] = [n];
    }
  });

  /**
   * 广度优先遍历当前树上所有节点
   * 遍历过程中新加的节点一定在下一层，所以也之后会遍历到，不会漏下任何节点
   */
  let queue = [root];
  while (queue.length) {
    let node = queue.shift();
    let resultChildren = resultMap[node.idValue];
    if (node.idValue != 0 && resultChildren) mergeChildren(node, resultChildren);
    if (node.children && node.children.length > 0) {
      //queue = [...queue, ...node.children];
      node.children.forEach(node => queue.push(node));
    }
  }
};


//---------------以下为对外暴露的方法----------------

const merge = (tree, nodesList, parentId) => {
  const root = tree[0];

  const sortedNodesList = sortNodes(nodesList);

  if (parentId !== undefined) {
    // nodesList 是某个 parent 下的 children
    let parentNode = BFS(root, node => node.idValue == parentId);
    mergeChildren(parentNode, sortedNodesList);
  } else {
    // nodesList 是整体搜索结果
    mergeSearch(root, sortedNodesList);
  }
  return [root];
};

/**
 * 合并结果到tree里
 * @param  {Object} [tree]      reducer里当前的客服tree
 * @param  {Array}  [nodesList] 接口返回的结果
 * @param  {Object} [parentId]  合并结果到该parent的children里
 * @return {Object}             
 */
const mergeTree = (tree, nodesList, parentId) => {
  nodesList = converData(nodesList);
  return merge(tree, nodesList, parentId);
};

const mergeGroupTree = (tree, nodesList, parentId) => {
  nodesList = converData(nodesList, true);
  return merge(tree, nodesList, parentId);
};

//设置根节点的文字，即全选时显示什么（一般直接设置好默认state就行，如果在设置默认state时无法得知全选时文字，则可以用这个方法）
const setRootTitle = (tree, title) => [{...tree[0], title}];

//设置默认state
const buildDefaultState = (rootTxt = '所有接待客服') => ({
  loading: true,
  tree: [{
    title: rootTxt,
    key: '0',
    value: '0',
    idValue: '0',
    type: 0,
  }]
});

export {mergeTree, mergeGroupTree, buildDefaultState, setRootTitle};
export default Base;
