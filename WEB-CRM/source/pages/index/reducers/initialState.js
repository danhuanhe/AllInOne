// 统一声明默认State
export default {
  UserData:{
    // 总数
    totalNum: 0,
    // 列表
    list: [],
    // 标记列表数据更新
    refreshTag: 0,

  },
  Filter:{
    leaders:[],
    list:[],//客户群列表
    fields:[],//客户群里可用的字段列表，{description: "0",id: -1,name: "姓名",operators:[{id:1,desc:'等于'}],type:0}
    fieldsMap:null,
    fieldsVal:[],//客户群下字段列表，含默认值,{description: "0",id: -1,name: "姓名",operator:{id:1,desc:'等于'},type:0,value:"",valueEx:""}
  }
  
};
/*
  field.type枚举
		0: 文本
		1: 单选
		2: 多选
		3: 时间
	operator.id枚举
		1: 等于
		2: 包含
		3: 为空
		4: 不为空
		5: 介于
		6: 不介于
		7: 早于
		8: 晚于
		9：小于
		10：大于

  field.description:单选或多选数据源，如果没有需要根据ID区分，去数据库加载数据源，例如： "[{"text":"VIP用户"},{"text":"普通用户"}]"
 */
