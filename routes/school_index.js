var express = require('express');
var router = express.Router();
const Klass = require('../models/tch_class');
const User = require('../models/user');
const crypto = require('crypto');

let tpagetitle = '教师校园工作台';
let spagetitle = '学生校园创作室';

/* GET 主页 page. */
router.get('/', function(req, res, next) {
  let _user = req.session.user;
  if(_user){
  	res.locals.user = _user;
  	if(_user.role == 9){
      Klass.findBytchid( _user._id, function(err,backmsg){
        if(err) console.log(err)
        res.render('teacher/tch_index', {
          title: tpagetitle,
          classlist:backmsg,
          active:'index'
        })
      })
	  }else if(_user.role == 0){
      res.redirect('/school/stutask/on')
	  }
  }else{
    res.redirect('error')
  }
})

module.exports = router;