var express = require('express');
var router = express.Router();
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

module.exports = router;
