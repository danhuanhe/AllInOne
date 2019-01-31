var express = require('express');
var router = express.Router();
var dbdaily= require('../dal/mongodb/daily');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test', function(req, res, next) {
  res.render('test', { 
    setting:{
      user:{
          userName: 'chx' ,
          roleType:1,
          realName:"陈焕许",
        }
      }
    });
});

router.get('/api/detailist',function(req, res, next){
  try {
      dbdaily.findDaily({},function (result) {
        res.json(result);
      });

  } catch (e) {
      res.status(500).json({ error: e.message });
  }
});
module.exports = router;
