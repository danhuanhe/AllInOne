import dev from './dev';
import prod from './prod';

// 着陆页
const landing = '/index/page/';
const common = {
  NOS_HOST: 'https://nos.netease.com',
  // 网站路由
  ROUTES: {
    HOME: {
      url: `${landing}`
    },
    APP: {
      name: '应用',
      key: 'app',
      url: `${landing}app/`
    }
  }
};

export const config = (
  process.env.NODE_ENV === 'production'
  ? Object.assign(common, prod)
  : Object.assign(common, dev));
