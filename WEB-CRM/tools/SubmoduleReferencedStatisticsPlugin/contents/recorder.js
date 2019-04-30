const loadJSON = (callback) => {   
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'recorder.json', true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      callback(xobj.responseText);
    }
  };
  xobj.send(null);  
};

const BFS = (root, callback) => {
  let queue = [root];
  while (queue.length) {
    let node = queue.shift();
    if (({}).toString.call(node) === '[object Object]') {
      Object.keys(node).forEach(key => queue.push(node[key]));
    } else {
      callback(node);
    }
  }
};

loadJSON(function(response) {
  const updateTable = (path) => {
    let curObj = recordObj;
    path.split('/').forEach((key) => {
      if (key) {
        curObj = curObj[key];
      }
    });

    const map = {};
    BFS(curObj, (fileUsedArr) => {
      fileUsedArr.forEach(({name, url}) => {
        if (!map[name]) map[name] = url;
      });
    });

    const tableWrapper = document.querySelector('#tableWrapper');
    tableWrapper.innerHTML = `<div id="desc">${path} 被以下项目使用了：</div>`;
    const table = document.createElement('table');
    table.innerHTML = '<thead><tr><th>name</th><th>url</th></tr></thead>';
    let hasTD = false;
    Object.keys(map).forEach(name => {
      hasTD = true;
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${name}</td><td>${map[name]}</td>`;
      table.append(tr);
    });

    // tableWrapper.innerHTML = '';
    if (hasTD) {
      tableWrapper.appendChild(table);
    } else {
      tableWrapper.innerHTML = `<div id="desc">${path} 没有被使用：</div>`;
    }
  }

  let recordObj = JSON.parse(response);
  const tree = jsonTree.create(recordObj, document.getElementById('jsonWrapper'));
  tree.collapse();
  updateTable('');

  let prevClickLabel;
  document.querySelectorAll('.jsontree_label').forEach(label => {
    label.addEventListener('click', (e) => {
      if (e.target === label) {
        if (label.closest('.jsontree_value_array')) {
          return;
        }
        label.style.color = 'red';
        if (prevClickLabel) prevClickLabel.style.color = '';
        prevClickLabel = label;
        let path = label.textContent.replace(/"/g, '');
        let parent = label.parentNode.parentNode.parentNode.closest(".jsontree_node");
        while (parent) {
          const child = parent.children[0].children[0];
          if (child.className.indexOf('jsontree_label') < 0) {
            break;
          }
          path = `${child.textContent.replace(/"/g, '')}/${path}`;
          parent = parent.parentNode.parentNode.parentNode.closest(".jsontree_node");
        }

        updateTable(path);
      }
    });
  });

  // document.querySelector('#search').addEventListener('keydown', (e) => {
  //   if (e.keyCode == 13) {
  //     let path = e.target.value;
  //   }
  // })
});