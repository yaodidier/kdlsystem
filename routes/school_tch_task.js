var express = require('express');
var router = express.Router();
const Klass = require('../models/tch_class');
const Task = require('../models/tch_task');
const TchWorks = require('../models/tch_works');
const User = require('../models/user');

let tpagetitle = '小幽校园 - 教师校园工作台';
let spagetitle = '小幽校园 - 学生校园创作室';
router.get('/', function(req, res, next) {
  let _user = req.session.user;
  let pagenum = req.query.page;
  if(_user && _user.role == 9){
    res.locals.user = _user;
    if(!pagenum){
      pagenum = 1
    }
    pagenum = parseInt(pagenum);
    var reg=/^[1-9]+\d*$/;
    if(reg.test(pagenum)){
      Task.find({creater:_user._id}).count().exec(function(err, pagecount){
        if(err) console.log(err);
        let _pagenum = (parseInt(pagenum)-1)*30;
        if(_pagenum < 0 || _pagenum > pagecount){
          res.redirect('error')
        }
        Task.find({creater:_user._id}).skip(_pagenum).limit(30).sort({'meta.updateAt':-1}).populate('classlist.classid','classname').exec(function(err, data){
          if(err) console.log(err);
          res.render('teacher/tch_task', { 
          	title: tpagetitle,
            tasklist:data,
            pagecount:pagecount,
            pageid:pagenum,
          	active:'task'
          });
        })
      })
    }else{
      res.redirect('error')
    }
  }else{
    res.redirect('error')
  }
});

//创建新任务
router.get('/new', function(req, res, next) {
  let _user = req.session.user;
  if(_user && _user.role == 9){
    res.locals.user = _user;
    Klass.findBytchid(_user._id,function(err, data){
      if(err) console.log(err);
      res.render('teacher/tch_task_new', {
        title: tpagetitle,
        classlist:data,
        active:'task'
      });
    })
  }else{
    res.redirect('error')
  }
});
//修改任务
router.get('/edit/:id', function(req, res, next) {
  let _user = req.session.user;
  const tid = req.params.id;
  if(_user && _user.role == 9){
    res.locals.user = _user;
    if(tid){
      Task.find({_id:tid}).populate('templet.workid','_id covers title').exec(function(err,taskdata){
        if(err) console.log(err);
        if(taskdata && taskdata.length > 0){
          Klass.findBytchid(_user._id,function(err, data){
            if(err) console.log(err);
            res.render('teacher/tch_task_edit', {
              title: tpagetitle,
              taskdata:taskdata[0],
              classlist:data,
              active:'task'
            });
          })
        }else{
          res.redirect('error')
        }
      })
    }else{
      res.redirect('error')
    }
  }else{
    res.redirect('error')
  }
});
//查看任务 作品
router.get('/detail/works/:id', function(req, res, next) {
  let _user = req.session.user;
  const tid = req.params.id;
  const cid = req.query.cid;
  let stu = req.query.stu;
  let stulist = [{
    type:'all',
    title:'全部状态'
  },{
    type:'review',
    title:'已评分'
  },{
    type:'unreview',
    title:'未评分'
  }]
  if(_user && _user.role == 9){
    res.locals.user = _user;
    if(tid){
      Task.find({_id:tid}).populate('classlist.classid','classname').exec(function(err,taskdata){
        if(err) console.log(err);
        if(taskdata && taskdata.length > 0){
          if(!cid || cid == 'all'){
            TchWorks.find({taskid:tid}).populate('stuid','_id headimg nickname').exec(function(err,wrokdata){
              if(err) console.log(err);
              let _workdata = [];
              if(stu && stu == 'review'){
                for(let i = 0;i < wrokdata.length; i++){
                  if(wrokdata[i].ismarking){
                    _workdata.push(wrokdata[i])
                  }
                }
              }else if(stu && stu == 'unreview'){
                for(let i = 0;i < wrokdata.length; i++){
                  if(!wrokdata[i].ismarking){
                    _workdata.push(wrokdata[i])
                  }
                }
              }else{
                stu = 'all'
                _workdata = wrokdata
              }
              res.render('teacher/tch_task_dworks', {
                title: tpagetitle,
                taskdata:taskdata[0],
                worklist:_workdata,
                active:'task',
                cid:'all',
                sidlist:stulist,
                sid:stu
              });
            })
          }else{
            TchWorks.find({taskid:tid,'classlist.classid': cid}).populate('stuid','_id headimg nickname').exec(function(err, wrokdata){
              if(err) console.log(err);
              let _workdata = [];
              if(stu && stu == 'review'){
                for(let i = 0;i < wrokdata.length; i++){
                  if(wrokdata[i].ismarking){
                    _workdata.push(wrokdata[i])
                  }
                }
              }else if(stu && stu == 'unreview'){
                for(let i = 0;i < wrokdata.length; i++){
                  if(!wrokdata[i].ismarking){
                    _workdata.push(wrokdata[i])
                  }
                }
              }else{
                stu = 'all'
                _workdata = wrokdata
              }
              res.render('teacher/tch_task_dworks', {
                title: tpagetitle,
                taskdata:taskdata[0],
                worklist:_workdata,
                active:'task',
                cid:cid,
                sidlist:stulist,
                sid:stu
              });
            })
          }
        }else{
          res.redirect('error')
        }
      })
    }else{
      res.redirect('error')
    }
  }else{
    res.redirect('error')
  }
});
//查看任务 学生列表
router.get('/detail/stulist/:id', function(req, res, next) {
  let _user = req.session.user;
  const tid = req.params.id;
  const cid = req.query.cid;
  let stu = req.query.stu;
  let stulist = [{
    type:'all',
    title:'全部状态'
  },{
    type:'upload',
    title:'已提交'
  },{
    type:'unload',
    title:'未提交'
  }];
  if(_user && _user.role == 9){
    res.locals.user = _user;
    if(tid){
      Task.find({_id:tid}).populate('classlist.classid','classname').exec(function(err,taskdata){
        if(err) console.log(err);
        if(taskdata && taskdata.length > 0){
          if(!cid || cid == 'all'){
            let classList = taskdata[0].classlist, _idList = [];
            for (var i = classList.length - 1; i >= 0; i--) {
              let idlist = {
                'classlist.klassid':classList[i].classid._id
              }
              _idList.push(idlist)
            }
            TchWorks.find({taskid:tid}).exec(function(err,wrokdata){
              if(err) console.log(err);
              User.find({$or:_idList}).populate('classlist.classid','_id classname').exec(function(err,studata){
                if(err) console.log(err);
                for(let i = 0;i < studata.length; i++){
                  let count = 0;
                  let taskList = studata[i].tasklist;
                  for(j = 0; j < taskList.length; j++){
                    if(taskList[j].taskid == tid){
                      count ++;
                    }
                  }
                  studata[i].taskstatus = count;
                };
                if(stu && stu == 'upload'){
                  studata = studata.filter(item => {
                    if(item.taskstatus > 0) {
                      return item;
                    }
                  })
                }else if(stu && stu == 'unload'){
                  studata = studata.filter(item => {
                    if(item.taskstatus == 0) {
                      return item;
                    }
                  })
                }else{
                  stu = 'all';
                }
                res.render('teacher/tch_task_dstatus', {
                  title: tpagetitle,
                  taskdata:taskdata[0],
                  stulist:studata,
                  active:'task',
                  cid:'all',
                  sidlist:stulist,
                  sid:stu
                });
              })
            })
          }else{
            TchWorks.find({taskid:tid,'classlist.classid': cid}).exec(function(err,wrokdata){
              if(err) console.log(err);
              User.find({'classlist.klassid':cid}).populate('classlist.classid','_id classname').exec(function(err,studata){
                if(err) console.log(err);
                for(let i = 0;i < studata.length; i++){
                  let count = 0;
                  let taskList = studata[i].tasklist;
                  for(j = 0; j < taskList.length; j++){
                    if(taskList[j].taskid == tid){
                      count ++;
                    }
                  }
                  studata[i].taskstatus = count;
                };
                if(stu && stu == 'upload'){
                  studata = studata.filter(item => {
                    if(item.taskstatus > 0) {
                      return item;
                    }
                  })
                }else if(stu && stu == 'unload'){
                  studata = studata.filter(item => {
                    if(item.taskstatus == 0) {
                      return item;
                    }
                  })
                }else{
                  stu = 'all';
                }
                res.render('teacher/tch_task_dstatus', {
                  title: tpagetitle,
                  taskdata:taskdata[0],
                  stulist:studata,
                  active:'task',
                  cid:cid,
                  sidlist:stulist,
                  sid:stu
                });
              })
            })
          }
        }else{
          res.redirect('error')
        }
      })
    }else{
      res.redirect('error')
    }
  }else{
    res.redirect('error')
  }
});
module.exports = router;
