var express = require('express');
var router = express.Router();
const Klass = require('../models/tch_class');
const Task = require('../models/tch_task');
const TchWorks = require('../models/tch_works');

let tpagetitle = '校园工作台';
let spagetitle = '学生校园创作室';
//已结束的作业
router.get('/:type', function(req, res, next) {
  const type = req.params.type;
  let _user = req.session.user;
  if(_user && _user.role == 0){
  	res.locals.user = _user;
    let classList = _user.classlist, _idList = [], _onlist = [], _endlist = [];
    for (var i = classList.length - 1; i >= 0; i--) {
      let idlist = {
        'classlist.classid':classList[i].klassid._id
      }
      _idList.push(idlist)
    };
    if(_idList.length > 0){
      Task.find({$or:_idList}).populate('classlist.classid','_id classname').exec(function(err,backmsg){
        if(err) console.log(err);
        let now = new Date().getTime();
        if(backmsg.length > 0){
          for (var i = backmsg.length - 1; i >= 0; i--) {
            let lastime = new Date(backmsg[i].endtime).getTime() - now;
            if(lastime > 0){
              _onlist.push(backmsg[i])
            }else{
              _endlist.push(backmsg[i])
            }
          }
        };
        if(type == 'on'){
          res.render('teacher/student/stu_index', {
            title: spagetitle,
            tasklist:_onlist,
            active:'index'
          })
        }else if(type == 'end'){
          res.render('teacher/student/stu_end', {
            title: spagetitle,
            tasklist:_endlist,
            active:'tasken'
          })
        }else{
          res.redirect('/stutask/on')
        }
      })
    }else{
      if(type == 'on'){
        res.render('teacher/student/stu_index', {
          title: spagetitle,
          tasklist:_onlist,
          active:'index'
        })
      }else if(type == 'end'){
        res.render('teacher/student/stu_end', {
          title: spagetitle,
          tasklist:_endlist,
          active:'tasken'
        })
      }else{
        res.redirect('/school/stutask/on')
      }
    }
  }else{
    res.redirect('error')
  }
});

// 作业详情
router.get('/detail/:id', function(req, res, next) {
  let _user = req.session.user;
  const tid = req.params.id;
  if(_user && _user.role == 0){
    res.locals.user = _user;
    Task.find({_id:tid}).populate('classlist.classid','classname').populate('templet.workid','user localsname title covers').exec(function(err,taskdata){
    	if(err){
    		res.redirect('/school/stutask/on')
    	}else{
    		TchWorks.findByhaswork(_user._id,tid,function(err,worklist){
    			if(err){
		    		res.redirect('/school/stutask/on')
		    	}else{
			      res.render('teacher/student/task_content', {
			        title: spagetitle,
			        taskdata:taskdata[0],
			        worklist:worklist,
			        active:''
			      })
			    }
	      })
    	}
	    
    })
  }else{
    res.redirect('error')
  }
});
module.exports = router;
