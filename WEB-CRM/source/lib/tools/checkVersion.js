/**
 * 当该git仓库作为子模块(子仓库)被引用时，判断该仓库的package.json的dependencies版本与父仓库的有哪些异同
 */

var fs = require('fs');
const { exec } = require('child_process');

if (!''.padEnd) {
  console.log('\x1b[33m%s\x1b[0m', '建议将node版本升级到8.2.1以上，优化以下内容的展现')
}

const log = (...args) => {
  let result = [];

  let index = 0;
  if (typeof args[1] === 'string') {
    // 说明args[0]也是string，即字符串模板
    index = 1;
    result.push(args[0]);
  }
  for (; index < args.length; index+=2) {
    const str = args[index];
    result.push(str.padEnd ? str.padEnd(args[index + 1] || 0) : str + ' ');
  }

  console.log(...result);
}

exec('git rev-parse HEAD', (err, lastCommitHash, stderr) => {
  if (err) return;

  if (lastCommitHash) {
    exec('cd .. && cd .. && git submodule', (err, submoduleInfo, stderr) => {
      if (err) return;
      if (submoduleInfo && submoduleInfo.indexOf(lastCommitHash.trim()) > -1) {
          // 当前git仓库作为子模块被引入
        let parentPackagePath = '../package.json';
        let count  = 5;
        while (!fs.existsSync(parentPackagePath) && count > 0) {
          count --;
          parentPackagePath = `../${parentPackagePath}`
        }
        let parentPackage = JSON.parse(fs.readFileSync(parentPackagePath, 'utf8'));
        let curPackage = JSON.parse(fs.readFileSync('package.json', 'utf8'));

        let maxLength1 = 0, maxLength2 = 0;
        Object.keys(curPackage.dependencies).forEach(key => {
          if (key.length > maxLength1) maxLength1 = key.length;
          if (curPackage.dependencies[key].length > maxLength2) maxLength2 = curPackage.dependencies[key].length;
        });

        log('\x1b[36m%s\x1b[0m', '检测到当前git仓库作为子模块被一个父仓库引用');
        log('\x1b[36m%s\x1b[0m', '当前git仓库中依赖的版本与父仓库中的比较如下：\n');
        log('dependencies', maxLength1 + 2, '当前仓库', maxLength2 - 1, '父仓库');
        Object.keys(curPackage.dependencies).forEach(key => {
          if (!parentPackage.dependencies[key]) {
            log('\x1b[2m%s%s%s\x1b[0m', key, maxLength1 + 3, curPackage.dependencies[key], maxLength2 + 4, '没有引入');
          } else if (curPackage.dependencies[key] !== parentPackage.dependencies[key]) {
            log('\x1b[33m%s%s%s\x1b[0m', key, maxLength1 + 3, curPackage.dependencies[key], maxLength2 + 4, parentPackage.dependencies[key]);
          } else {
            log('\x1b[32m%s%s%s\x1b[0m', key, maxLength1 + 3, curPackage.dependencies[key], maxLength2 + 4, parentPackage.dependencies[key]);
          }
        });
        console.log(
          "\n\x1b[36m%s\x1b[33m%s\x1b[36m%s\x1b[0m",
          "虽然以上模块不应在当前仓库中被install（你不应在子仓库里执行“npm install”），这样打包时使用的就是父仓库中的node_modules，因而不会有版本冲突的问题，",
          "但该子仓库的package.json里标识的版本应作为父仓库使用时的参考",
          "。建议同步两边的版本号，或使父仓库的大于当前仓库"
        );
      }
    });
  }
});