const fs = require('fs');
const { execSync } = require('child_process');

const DFS = (parent, checkIfDelete) => {
  let allChildrenDeleted = true;
  Object.keys(parent || {}).forEach(key => {
    const value = parent[key];
    if (({}).toString.call(value) === '[object Object]') {
      if (DFS(value, checkIfDelete)) {
        delete parent[key];
      } else {
        allChildrenDeleted = false;
      }
    } else {
      if (checkIfDelete(value)) {
        delete parent[key];
      } else {
        allChildrenDeleted = false;
      }
    }
  });

  return allChildrenDeleted;
}


export default class SubmoduleReferencedStatisticsPlugin {
  constructor({name, submodule = {}, __dirname = __dirname}) {
    this.name = name;
    this.submodule = submodule;
    this.__dirname = __dirname;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'SubmoduleReferencedStatisticsPlugin',
      (compilation, callback) => {
        const stdout1 = execSync('git config --file .gitmodules --get-regexp url', {encoding: 'utf-8'});
        const submoduleUrlsArr = stdout1.split('\n').filter(val => val).map(str => str.split(' ')[1]);
    
        submoduleUrlsArr.forEach((url, i) => {
          if (this.submodule.url === url) {
            const stdout2 = execSync('git config --file .gitmodules --get-regexp path', {encoding: 'utf-8'});
            if (!stdout2) {
              console.log('\x1b[31m%s\x1b[0m', '未检测到git子模块，SubmoduleReferencedStatisticsPlugin不启用');
              return;
            }
            const submodulePathsArr = stdout2.split('\n').filter(val => val).map(str => str.split(' ')[1]);
            const submodulePath = this.submodule.dir || `${this.__dirname}/${submodulePathsArr[i]}`;
            const folderPath = `${submodulePath}/${this.submodule.recorderFolder}/recorder`;
            const filePath = `${folderPath}/recorder.json`;

            // 如果文件夹不存在就创建文件夹（递归创建仅支持node版本 > 10.12.0。）
            fs.mkdirSync(folderPath, { recursive: true });
            let recorder = {};
            if (fs.existsSync(filePath)) {
              recorder = JSON.parse(fs.readFileSync(filePath, 'utf8') || '{}');
            }
            fs.readdir(`${__dirname}/contents`, function(err, filenames) {
              if (err) {
                console.log(err);
                return;
              }
              filenames.forEach(function(filename) {
                if (!fs.existsSync(`${folderPath}/${filename}`)) {
                  // node版本 > 8.5.0
                  fs.copyFile(`${__dirname}/contents/${filename}`, `${folderPath}/${filename}`, (err) => {
                    if (err) console.log(err);
                  });
                }
              });
            });

            const remoteUrl = execSync('git config --get remote.origin.url', {encoding: 'utf-8'}).replace(/(\n)|(\r\n)/, '');
            const name = this.name || remoteUrl.match(/.*\/(.*?)(.git){0,1}$/m)[1];
            
            // recorder里关于当前项目的记录全部清除（主要考虑到该项目原先引用了子模块一个文件，然后不再引用了，
            // recorder里也应删除相关记录，这样先直接全删然后把新的fileDependencies整体更新过去比较简便）
            DFS(recorder, (arr) => {
              let i = 0;
              while (i < arr.length) {
                if (arr[i].name === name) arr.splice(i, 1);
                else i++;
              }

              return arr.length < 1;
            });

            // 更新到recorder里
            compilation.fileDependencies.forEach(path => {
              if (path.indexOf(submodulePath) === 0 && !new RegExp(this.submodule.excludePathRegex).test(path)) {
                let subPath = path.replace(submodulePath, '');

                let curFolderObj = recorder;
                const subPathArr = subPath.split('/');
                // 写进recorder对象里
                subPathArr.forEach((folder, i) => {
                  if (!folder) return;

                  if (i === subPathArr.length - 1) {
                    // 这里的“folder”其实是文件名了
                    if (!curFolderObj[folder]) curFolderObj[folder] = [];
                    curFolderObj[folder].push({
                      name,
                      url: remoteUrl,
                    });
                    return;
                  }

                  // 没有当前文件夹下的记录，新生成
                  if (!curFolderObj[folder]) curFolderObj[folder] = {};
                  curFolderObj = curFolderObj[folder];
                });
              }
            });

            // 写入文件
            fs.writeFile(filePath, JSON.stringify(recorder, null, 2), (err) => {
              if (err) {
                console.log('\x1b[31m%s\x1b[0m', '子模块引用记录更新失败');
              } else {
                console.log('\x1b[32m%s\x1b[0m', '子模块引用记录已更新');
              }
            });
          }
        });

        callback();
      }
    );
  }
}
