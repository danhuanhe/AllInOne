const { exec, spawn } = require('child_process');

console.log('正在安装commit时的代码检查需要的模块...\n');
const install = spawn(
  "npm",
  [
    "install",
    "husky",
    "lint-staged",
    "stylelint",
    "stylelint-config-standard",
    "eslint",
    "eslint-plugin-import",
    "eslint-plugin-jsx-a11y",
    "eslint-plugin-react",
    "--no-package-lock",
    "--no-save",
    "--only=dev"
  ],
  {
    stdio: "inherit"
  }
);

install.on('error', (err) => {
  console.log(err)
});

install.on('close', (code) => {
  if (code == 0) {
    console.log("\x1b[32m%s\x1b[0m", "\n-----------------安装完成-----------------");

    setTimeout(() => {
      exec("npm run checkVersion", (err, stdout2, stderr) => {
        console.log(stdout2);
      });
    }, 1000);
  } else {
    console.log("\x1b[31m%s\x1b[0m", "安装失败");
  }
});
