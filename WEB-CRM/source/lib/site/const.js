
// 取出路径中的键
let KEY_PATH = /\.\/(\w+)\/doc.(md|js)$/i;

let cubexDocMd = require.context('../cubex/Components', true, /doc\.md$/);
let cubexDocJs = require.context('../qiyu/Components', true, /doc\.js$/);
let qiyuDocMd = require.context('../qiyu/Components', true, /doc\.md$/);
let qiyuDocJs = require.context('../qiyu/Components', true, /doc\.js$/);


const qiyuComponentList = buildComponentList(qiyuDocMd, qiyuDocJs, 'qiyu');

const cubexComponentList = buildComponentList(cubexDocMd, cubexDocJs, 'cubex');

export const componentList = {
  qiyu: {
    name: "七鱼",
    list: qiyuComponentList
  },
  cubex: {
    name: "先知",
    list: cubexComponentList
  }
};


function buildComponentList(docMd, docJs, belonger) {

  // ['./MenuTab/doc.md',./MenuOnPPP/doc.md']
  //从路径得到component的key
  let components = docMd.keys().map(path => {
    let match = KEY_PATH.exec(path);
    if (match) {
      let component = match[1];
      let componentName = component; // 这个路径得不到名称信息
      return {
        key: component,
        name: componentName,
        belonger: belonger
      };
    } else {
      return null;
    }
  }).filter(x => x !== null);

  //查找含有docJs的组件，变换名称，处理依赖
  docJs.keys().forEach(path => {
    let match = KEY_PATH.exec(path);
    if (match) {
      let key = match[1];
      let target = components.find(x => x.key === key);
      //target就是下面的qiyuComponentList中的元素
      if (target) {
        let { name, deps } = docJs(path) || {};

        // 处理name
        if (name) { target.name = name; }

        //处理依赖
        if (deps) {
          target.deps = deps;
        }
      }
    }
  });
  return components;
}
