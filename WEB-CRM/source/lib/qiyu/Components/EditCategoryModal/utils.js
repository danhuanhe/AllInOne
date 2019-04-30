const levelsTextSet = ['一级分类', '二级分类', '三级分类', '四级分类', '五级分类'];

/**
 * 获取递归树对应多少层级
 * @param root
 * @returns {Array} [{name:'一级分类',index:-1,item:null}]
 */
export const getCategoryLevels = (root) => {
  if (!root.children) return [];

  let level = getLevel(root.children),
    levels = [];

  for (let i = 0; i < level; i++) {
    levels.push({
      name: levelsTextSet[i],
      index: -1,
      itm: null
    });
  }
  return levels;
};

/**
 * 计算树状结构最大层级是多少（递归算法）
 * @param list  根结点数组
 * @returns {number} 返回层级数
 */
const getLevel = (list) => {
  if (!list) return 0;

  let max_child_level = 0; //孩子中最大的层级

  for (let i = 0; i < list.length; i++) {
    let l = getLevel(list[i].children);
    if (l > max_child_level) max_child_level = l;
  }
  return max_child_level + 1;
};

/**
 * 更新层级信息
 * @param levels 层级信息
 * @param root   树状根结点信息
 */
export const updateCategoryLevels = (levels, root) => {
  levels[0].itm = root;

  for (let i = 0; i < levels.length - 1; i++) {
    let cur_index = levels[i].index;
    levels[i + 1].itm = levels[i].itm && levels[i].itm.children && levels[i].itm.children[cur_index];
  }
  return levels;
};

/**
 * 添加一个层级
 * @param levels 之前的层级信息
 * @param itm
 */
export const addCategoryLevel = (levels, itm) => {
  let len = levels.length;
  levels.push({
    name: levelsTextSet[len],
    index: -1,
    itm: itm
  });
};


