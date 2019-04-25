var dailydoc ={
  "_id" : 0,
  "type":0,
  "accountId" : 0,
  "date":"",
  "createTime" : 0,
  "editTime" : 0,
  "creatorId" : 0,
  "creator" : "admin",
  "sumMoney" : 0,
  "content" : "无"
};
var collname="daily";
var dbhelper = require('../../dbdriver/mongodb');

exports.findDaily = function (query,cb) {console.log(query);
  var _sort={};
  _sort[query.sortby]=+query.sort;
  var options={
    limit:+query.limit,
    skip:+query.offset,
    sort:_sort
  };
  
  delete query.limit;delete query.offset;delete query.sort;delete query.sortby;
  dbhelper.findData(collname,query, options,cb);
};


exports.insertDaily = function (data, cb) {
  data=Object.assign(dailydoc,data);
  //data._id = "_id: db.sysids  .findAndModify({update: { $inc: { 'newid':1 } },query: { '_id':'blogtagid' },new:true}).newid";
  data._autoid = {
      //incIdCollectioname: collname, //在系统集合里主键--其值用于确定newid的值是哪个集合的递增字段的值,可省略，因为跟集合名一样
      //id: "_id"//其他集合里被配置为自定义递增的字段,一般也是_id 可省略
  };
  dbhelper.insertData(collname, data, cb);
};

exports.updateDaily = function (id,data,cb) {
  dbhelper.updateData(collname, {_id:id}, data,cb);
};

exports.deleteDailyById = function (id,cb) {
  dbhelper.deleteOne(collname, {_id:id},{},function(result){
    dbhelper.deleteMany("dailyitem", {dailyId:id},{},function(){
     cb && cb(result);
    });
  });
};

