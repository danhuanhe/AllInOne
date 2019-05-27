var express = require('express');
var router = express.Router();
var dbdaily= require('../dal/mongodb/daily');
var dbdailyItem= require('../dal/mongodb/dailyitem');
/* GET home page. */
router.get('/daily', function(req, res, next) {
  res.render('daily/daily', { title: 'Express' });
});

router.get('/api/dailylist',function(req, res, next){
  try {console.log(req.query);
      dbdaily.findDaily(req.query,function (result) {
        res.json(result);
      });

  } catch (e) {
      res.status(500).json({ error: e.message });
  }
});

router.get('/api/daily/get',function(req, res, next){
  try {
      var q=req.query;
      dbdaily.findDaily({
        _id:+q.id
      },function (result) {
         var daily=result.data;
         if(daily.length){
            daily=daily[0];
              //res.json(result);
            dbdailyItem.findItems({dailyId:+q.id},function(re){
              daily.items=re.data;console.log(daily);
              res.json({
                code:200,
                result:daily
              });
          });
         }
         
      });

  } catch (e) {
      res.status(500).json({ error: e.message });
  }
});

router.post('/api/daily/save',function(req, res, next){
  try {
    let jsonData=req.body;
    if(typeof jsonData=="string"){
      jsonData=JSON.parse(jsonData);
    }
    let sum=0;
    let cont="";
    if(jsonData&&jsonData.items){
      jsonData.items.map(item=>{
        sum+=item.money;
        cont+=item.content+"\n";
      });
    }
    var dailydoc ={
      "type":jsonData.type,
      "accountId" : jsonData.accountId,
      "date":jsonData.date,
      "createTime" : jsonData.createTime,
      "editTime" : jsonData.editTime,
      "creatorId" : 0,
      "creator" : "admin",
      "sumMoney" : sum,
      "content" : cont
    };
    dbdaily.insertDaily(dailydoc,function (result) {
        var dd=result.data;
        if(dd.insertedCount){
          let did=dd.insertedIds['0'];
          jsonData.items.map(item=>{
            item.dailyId=did;
          });//console.log(jsonData.items);
          dbdailyItem.insertItems(jsonData.items,()=>{res.json(result);});
        }
    });

  } catch (e) {
      res.status(500).json({ error: e.message });
  }
});

router.post('/api/daily/delByIds',function(req, res, next){
  try {
    let jsonData=req.body;
    if(typeof jsonData=="string"){
      jsonData=JSON.parse(jsonData);
    }
    let delLen=0;
    if(jsonData&&jsonData.length){
      jsonData.map(id=>{
        dbdaily.deleteDailyById(id,function (result) {
          delLen++;
        });
      });
    }
    res.json({
      code:200,message:"",result:{deletedCount:delLen}
    });

  } catch (e) {
      res.status(500).json({ error: e.message });
  }
});

module.exports = router;
