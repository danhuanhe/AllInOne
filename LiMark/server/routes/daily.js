var express = require('express');
var router = express.Router();
var dbdaily= require('../dal/mongodb/daily');
/* GET home page. */
router.get('/daily', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/dailylist',function(req, res, next){
  try {
      dbdaily.findDaily({},function (result) {
        res.json(result);
      });

  } catch (e) {
      res.status(500).json({ error: e.message });
  }
});

router.post('/api/daily/save',function(req, res, next){
  try {
    const jsonData=res.json(req.body);
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
    //console.log(req.body);
    dbdaily.insertDaily({},function (result) {
        console.log(result);
    });

  } catch (e) {
      res.status(500).json({ error: e.message });
  }
});

module.exports = router;
