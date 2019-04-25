var dailydoc ={
  //"_id" : 0,
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
var collname="dailyitem";
var dbhelper = require('../../dbdriver/mongodb');

exports.findItems = function (where,cb) {
  dbhelper.findData(collname, {}, where,cb);
};


exports.insertItems = function (data, cb) {

  dbhelper.insertDataMany(collname, data, cb);
};

exports.updateDaily = function (id,data,cb) {
  dbhelper.updateData(collname, {_id:id}, data,cb);
};

exports.deleteDailyById = function (id,cb) {
  dbhelper.deleteData(collname, {_id:id},{justOne:true},cb);
};

