// 统一声明默认State
const {app} = window.setting || {};
const {name, account, role, id} = app || {};

export default {
  // 页面全局状态
  header: {
    // 是否已登录认证
    isAuthenticated: true,
    // 姓名
    name: name || '',
    // 账号
    account: account || '',
    // 角色权限
    role,
    // 账号id
    id
  }
};
