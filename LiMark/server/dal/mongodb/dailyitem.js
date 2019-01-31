var dailydoc ={
  "_id" : 0,
  "dailyId":0,//所属日报
  "accountId" : 0,//所属账本
  "createTime" : 0,
  "editTime" : 0,
  "creator" : "admin",
  "creatorId" : 0,
  "money" : 0,
  "time" : 0,
  "place" : "",
  "persons" : "",
  "content" : "无",
  "type" : 0,
  "level" : "1"
};
var collname="limark";
var dbhelper = require('../../dbdriver/mongodb');

exports.findDaily = function (where,cb) {
  dbhelper.findData(collname, {}, where,cb);
};


exports.insertDaily = function (data, cb) {
  //data._id = "_id: db.sysids  .findAndModify({update: { $inc: { 'newid':1 } },query: { '_id':'blogtagid' },new:true}).newid";
  data._autoid = {
      //autoidcoll: collname, //在系统集合里主键--其值用于确定newid的值是哪个集合的递增字段的值,可省略，因为跟集合名一样
      //id: "_id"//其他集合里被配置为自定义递增的字段,一般也是_id 可省略
  };
  dbhelper.insertData(collname, data, cb);
};

exports.updateDaily = function (id,data,cb) {
  dbhelper.updateData(collname, {_id:id}, data,cb);
};

exports.deleteDailyById = function (id,cb) {
  dbhelper.deleteData(collname, {_id:id},{justOne:true},cb);
};

