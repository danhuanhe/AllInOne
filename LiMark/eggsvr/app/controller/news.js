const Controller = require('egg').Controller;

class NewsController extends Controller {
  async list() {
    const dataList = {
      list: [
        { id: 1, title: 'this is news 1111' + this.ctx.isIOS + '-' + this.ctx.reg.isNumber('23232'), url: '/news/1', time: new Date() },
        { id: 2, title: 'this is news 2' + this.ctx.isIOS + '-' + this.ctx.reg.isNumber('wetet'), url: '/news/2', time: new Date() },
      ],
    };
    await this.ctx.render('news/list.htm', dataList);
  }
}

module.exports = NewsController;
