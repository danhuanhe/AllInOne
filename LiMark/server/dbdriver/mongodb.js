//测试集合-表
var config = require('../config');
var MongoClient = require('mongodb').MongoClient;
const dbName=config.dbName;
/*
collectioname:集合名，即表名:string
query:{}
options:{limit,skip,sort}
callback：查询完成后的回调函数:function
*/
exports.findData = function (collectioname, query, options, callback) {
    //使用客户端连接数据，并指定完成时的回调方法
    MongoClient.connect(config.mongodbConnStr,{useNewUrlParser: true }, function (err, client) {
        if (err) {
            console.log('Error:' + err);
            callback({ code: 500, msg: err.toString()});
            return;
        }
        //获得指定的集合 
        const collection = client.db(dbName).collection(collectioname);
        console.log("mongodb driver find(",query,",",options,")");
        collection.countDocuments(query, {},function (err, result) {
            //如果存在错误
            if (err) {
                console.log('Error:' + err);
                callback({ code: 500, msg: err.toString() });
                return;
            }
            const total=result;
            collection.find(query, options).toArray(function (err, result) {
                //result:[{},{},...]
                client.close();
                //如果存在错误
                if (err) {
                    console.log('Error:' + err);
                    callback({ code: 500, msg: err.toString() });
                    return;
                }
                //调用传入的回调方法，将操作结果返回
                callback({ code: 200, data: result,total:total});
            });
        });
        
    });
};

/*
collectioname:集合名
data：插入集合的简单键值对对象
callback：插入成功后的回调函数
*/
exports.insertData = function (collectioname, data, callback) {
    //使用客户端连接数据，并指定完成时的回调方法
    MongoClient.connect(config.mongodbConnStr,{useNewUrlParser:true}, function (err, client) {
        if (err) {
            console.log('Error:' + err);
            callback({ code: 500, msg: err.toString() });
            return;
        }
        //获得指定的集合 
        var db=client.db(dbName);
        var collection = db.collection(collectioname);
        //配置了自定义递增方案
        if (data._autoid) {
            var inc = {};
            var inckey = data._autoid.inckey || "newid";
            var autoidcoll = data._autoid.autoidcoll || collectioname;
            var id = data._autoid.id || "_id";
            var incIdCollectioname=data._autoid.incIdCollectioname || "sysids";
            inc[inckey] = 1;
            //从保存ID递增值的表（sysids）里查找目前最大newid的一个值，作为新纪录的ID
            //sysids这个集合的格式为：{_id:"其他集合名",newid:"其他集合主键的最大值"}
            db.collection(incIdCollectioname).findOneAndUpdate(
                { _id: autoidcoll}, { $inc: inc }, { returnOriginal: false }, function (err, result) {
                    if (err) {
                        console.log(err);
                        return cb(err);
                    }
                    data[id] = result.value[inckey];

                    delete data._autoid;
                    collection.insert(data, function (err, result) {
                        //result:{insertedCount:1,insertedIds:[11],ops:[{}],result:{ok:1,n:1}}
                        client.close();
                        if (err) {
                            console.log('Error:' + err);
                            callback({ code: 500, msg: err.toString() });
                            return;
                        }
                        //调用传入的回调方法，将操作结果返回
                        callback({ code: 200, data: result });
                    });

                });
        } else {
            collection.insert(data, function (err, result) {
              client.close();
                if (err) {
                    console.log('Error:' + err);
                    callback({ code: 500, msg: err.toString() });
                    return;
                }
                //调用传入的回调方法，将操作结果返回
                callback({ code: 200, data: result });
            });
        }

    });
};

exports.insertDataMany = function (collectioname, manyData, callback) {
    //使用客户端连接数据，并指定完成时的回调方法
    MongoClient.connect(config.mongodbConnStr, function (err, client) {
        if (err) {
            console.log('Error:' + err);
            callback({ code: 500, msg: err.toString() });
            return;
        }
        //获得指定的集合 
        var db=client.db(dbName);
        var collection = db.collection(collectioname);
        collection.insertMany(manyData,{}, function (err, result) {
            client.close();
            if (err) {
                console.log('Error:' + err);
                callback({ code: 500, msg: err.toString() });
                return;
            }
            //调用传入的回调方法，将操作结果返回
            callback({ code: 200, data: result });
        });
    });
};
/*
collectioname:集合名
where：作为条件的简单键值对对象
updatedata：修改集合的简单键值对对象
callback：插入成功后的回调函数
*/
exports.updateData = function (collectioname, where, updatedata, callback) {
    //使用客户端连接数据，并指定完成时的回调方法
    MongoClient.connect(config.mongodbConnStr, function (err, client) {
        if (err) {
            console.log('Error:' + err);
            callback({ code: 500, msg: err.toString() });
            return;
        }
        var db=client.db(dbName);
        //获得指定的集合 
        var collection = db.collection(collectioname);

        //更新数据
        //var where = { "id": 111 };
        //data={name:"aaaaaaaa",id:111,age:12}
        for (var k in updatedata) {
            if (where[k.toString()]) {
                delete updatedata[k.toString()];//删除包含在条件对象里的字段
            }
        }
        collection.update(where, {$set: updatedata}, function (err, result) {
            //result:{n:1,nModified:1,ok:1}
            client.close();
            if (err) {
                console.log('Error:' + err);
                callback({ code: 500, msg: err.toString() });
                return;
            }
            //调用传入的回调方法，将操作结果返回
            callback({ code: 200, data: result });
        });


    });
};

exports.deleteOne = function (collectioname, where, options, callback) {
    //使用客户端连接数据，并指定完成时的回调方法
    MongoClient.connect(config.mongodbConnStr, function (err, client) {
        if (err) {
            console.log('Error:' + err);
            callback({ code: 500, msg: err.toString() });
            return;
        }
        var db=client.db(dbName);
        //获得指定的集合 
        var collection = db.collection(collectioname);
        console.log('deleteOne:' + JSON.stringify(where));
        collection.deleteOne(where, options, function (err, result) {
            //result.result:{n:1,ok:1}
            client.close();
            if (err) {
                console.log('Error:' + err);
                callback({ code: 500, msg: err.toString() });
                return;
            }
            //调用传入的回调方法，将操作结果返回
            callback({ code: 200, data: result.result });
        });


    });
};

exports.deleteMany = function (collectioname, where, options, callback) {
    //使用客户端连接数据，并指定完成时的回调方法
    MongoClient.connect(config.mongodbConnStr, function (err, client) {
        if (err) {
            console.log('Error:' + err);
            callback({ code: 500, msg: err.toString() });
            return;
        }
        var db=client.db(dbName);
        //获得指定的集合 
        var collection = db.collection(collectioname);
        console.log('deleteMany:' + JSON.stringify(where));
        collection.deleteMany(where, options, function (err, result) {
            //result.result:{n:1,ok:1}
            client.close();
            if (err) {
                console.log('Error:' + err);
                callback({ code: 500, msg: err.toString() });
                return;
            }
            //调用传入的回调方法，将操作结果返回
            callback({ code: 200, data: result.result });
        });


    });
};