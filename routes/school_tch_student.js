var express = require('express');
var router = express.Router();
const Klass = require('../models/tch_class');
const User = require('../models/user');

let tpagetitle = '教师校园工作台';
let spagetitle = '学生校园创作室';

/* GET users listing. */
router.get('/', function(req, res, next) {
	let classid = req.query.classid;
	let _user = req.session.user;
  if(_user && _user.role == 9){
  	let _userid = _user._id;
  	res.locals.user = _user;
  	Klass.findBytchid(_userid, function(err, classlist){
  		if(classid){
	  		if(err) console.log(err);
	  		let classinfo = '';
	  		for(let i = 0;i < classlist.length; i++){
	  			if(classid == classlist[i]._id){
	  				classinfo = classlist[i]
	  			}
	  		}
	  		if(classinfo){
	  			User.fetchByclassid(classid, function(err,studata){
  					if(err) console.log(err);
  					res.render('teacher/tch_student', {
							title: tpagetitle,
							stulist: studata,
							classinfo: classinfo,
							classlist:classlist,
							active: 'student'
						});
  				});
	  		}else{
	  			res.redirect('/school/student/all');
	  		}
		  }else{
		  	res.redirect('/school/student/all');
			}
		})
  }else{
  	res.redirect('error');
  }
});
router.get('/all', function(req, res, next) {
	let _user = req.session.user;
  if(_user && _user.role == 9){
  	let _userid = _user._id;
  	res.locals.user = _user;
  	Klass.findBytchid(_userid, function(err, classlist){
	  	User.find({'tchlist.teacherid':_userid}).populate('classlist.klassid','classname').exec(function(err, stualldata){
				res.render('teacher/tch_search', { 
					title: tpagetitle,
					classlist:classlist,
					stulist: stualldata,
					active:'student'
				});
			})
		})
  }else{
  	res.redirect('/');
  }
});
module.exports = router;
