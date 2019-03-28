const express = require('express');
const Banner = require('../models/banner');
const User = require('../models/user');
const Works = require('../models/works');
const Ufollow = require('../models/ufollow');
const Suggest = require('../models/suggest');
const FeedBack = require('../models/feedback');
const Notice = require('../models/notice');
const Klass = require('../models/tch_class');
const Task = require('../models/tch_task');
const TchWorks = require('../models/tch_works');
const crypto = require('crypto')
const multer  = require('multer');
const XLSX  = require('xlsx');
const _ = require('underscore');
const nodeUuid = require('node-uuid');
const router = express.Router();
const moment = require('moment');
moment.locale('zh-CN');

let govname = '编程社区';
let pagetitle = '凯智创客编程社区';
let tpagetitle = '教师校园工作台';
/* GET home page. */
router.get('/', function(req, res, next) {
  let _user = req.session.user;
  if(_user){
    res.locals.user = _user
  }
  Banner.find({}).exec(function(err,banners){
    Works.find({}).sort({zan:-1}).limit(10).populate('user','headimg nickname').exec(function(err, hotlist){
      if(err){console.log(err)}
      Works.find({}).sort({keep: -1}).limit(10).populate('user','headimg nickname').exec(function(err, keeplist){
        if(err){console.log(err)}
        Works.find({}).sort({'meta.createAt': -1}).limit(10).populate('user','headimg nickname').exec(function(err, newlist){
          res.render('index', {
            title: pagetitle,
            banners:banners,
            hotlist:hotlist,
            keeplist:keeplist,
            newlist:newlist
          });
        });
      })
    })
  })

});
//产品简介
router.get('/ourjob', function(req, res, next) {
  let _user = req.session.user;
  if(_user){
    res.locals.user = _user
  }
  res.render('support', {
    title: pagetitle
  });
});
/*  login  */
router.post('/signin', function(req, res, next) {
  const userhash = crypto.createHash('sha1');
  const user_name = req.body.username;
  const user_pwd = req.body.userpwd;
  if(user_name && user_pwd){
  	const hash_pwd = userhash.update('xiaou').update(user_pwd).digest('hex');
  	User.fetchByName(user_name, function(err,usermsg){
	  	if(err){
	    	console.log(err);
        res.send({
          status: 'fail',
          msg:'服务器抢修中，暂时无法登陆'
        })
	  	}else{
        if(usermsg.length == 0){
          res.send({
            status:'nouser',
            msg:'账号或密码错误'
          })
        }else{
          if(hash_pwd == usermsg[0].password){
            if(usermsg[0].status == -1 || usermsg[0].status == -2){
              res.send({
                status:'fail',
                msg:'账号已被禁封'
              })
            }else{
              req.session.user = usermsg[0];
              res.send({
                status:'success'
              })
            }
          }else{
            res.send({
              status:'pwderror',
              msg:'账号或密码错误',
            })
          }
        }
	  	}
    });
  }
});
/*  regsiter  */
router.post('/register', function(req, res, next) {
  const userhash = crypto.createHash('sha1');
  const user_name = req.body.username;
  const nick_name = req.body.nickname;
  const user_pwd = req.body.userpwd;
  let _usermsg;
  if(user_name && user_pwd){
    const hash_pwd = userhash.update('xiaou').update(user_pwd).digest('hex');
    User.fetchByName(user_name, function(err, data){
      if(err){
        console.log(err);
        res.send({
            status: 'fail',
            msg:'服务器抢修中，暂时无法注册'
        })
      }else{
        if(data.length == 0){
          _usermsg = new User({
            username: user_name,
            password: hash_pwd,
            nickname: nick_name,
            realname:'',
            headimg:'/img/headimg/person-icon.png',
            email:'',
            phoneNum:'',
            qq:'',
            wx:'',
            motto:'喔~ hohohoho',
            noticenum:1
          });
          _usermsg.save(function(err,data){
            if (err) {
              console.log(err);
              res.send({
                status: 'fail'
              })
            }else{
              req.session.user = data;
              let new_notice = new Notice({
                user:data._id,
                message:[{
                  title:'欢迎来到凯智学院',
                  content:'【欢迎来你到凯智学院】很高兴你能成为我们的一员，在这里你将体验不一样的编程乐趣，我们搭载了最新的 scratch3.0，赶紧去体验吧！',
                  createAt:moment(new Date()).format('LL')
                }]
              });
              new_notice.save(function(err){
                if(err){console.log(err)}
                let new_ufans = new Ufollow({
                  userid:data._id,
                });
                new_ufans.save(function(err){
                  if(err){console.log(err)}
                  res.send({
                    status: 'success'
                  })
                })
              })

            }
          })
        }else{
          res.send({
            status: 'fail',
            msg:'该账号已被其他用户注册'
          })
        }
      }
    })
  }
});
// 修改密码
function hashpwd(user_pwd){
  const userhash = crypto.createHash('sha1');
  return userhash.update('xiaou').update(user_pwd).digest('hex');
}
router.post('/users/change/password', function(req, res, next) {
  const oldpwd = req.body.old_pwd;
  const newpwd = req.body.new_pwd;
  const userhash = crypto.createHash('sha1');
  let _user = req.session.user;
  if(_user && oldpwd && newpwd){
    User.findOne({_id:_user._id}).exec(function(err, user_msg){
      if(err) console.log(err);
      if(user_msg.password == hashpwd(oldpwd)){
        User.updateOne({_id:_user._id},{$set:{password:hashpwd(newpwd)}}).exec(function(err){
          res.send({
            status: 'success'
          })
        })
      }else{
        res.send({
          status:'fail',
          msg:'旧密码错误'
        })
      }
    })
  }else{
    res.send({
      status:'fail',
      msg:'修改失败'
    })
  }
});

// logout
router.get('/logout', function(req, res, next) {
  delete req.session.user;
  res.redirect('/')
});

// 关于我们
router.get('/aboutus', function(req, res, next) {
  let _user = req.session.user;
  if(_user){
    res.locals.user = _user
  }
  res.render('aboutus', {
    title: pagetitle
  });
});

// 产品建议
router.get('/suggest', function(req, res, next) {
  let _user = req.session.user;
  if(_user){
    res.locals.user = _user
  }
  res.render('suggest', {
    title: pagetitle
  });
});
// 产品建议接口
router.post('/user/suggest', function(req, res, next) {
  let suggest = {
    user: req.body.userid,
    content:req.body.content
  }
  if(suggest.content && suggest.user){
    new Suggest(suggest).save(function(err){
      if(err){console.log(err)}
      res.send({
        status:'success'
      })
    })
  }else{
    res.send({
      status:'fail'
    })
  }

});
// 问题反馈
router.get('/feedback', function(req, res, next) {
  let _user = req.session.user;
  if(_user){
    res.locals.user = _user
  }
  res.render('feedback', {
    title: pagetitle
  });
});
// 问题反馈接口
router.post('/user/feedback', function(req, res, next) {
  let feedback = {
    user: req.body.userid,
    content:req.body.content
  }
  if(feedback.content && feedback.user){
    new FeedBack(feedback).save(function(err){
      if(err){console.log(err)}
      res.send({
        status:'success'
      })
    })
  }else{
    res.send({
      status:'fail'
    })
  }
});

//以下是校园接口
//搜索学生
router.get('/searchstu', function(req, res, next) {
  let _user = req.session.user;
  if(_user && _user.role == 9){
    res.locals.user = _user;
    let studentname = req.query.wd;
    if(studentname){
      User.find({role:0, nickname:studentname}).populate('classlist.klassid','classname').exec(function(err,sbackmsg){
        if(err) console.log(err);
        Klass.findBytchid( _user._id, function(err,cbackmsg){
          if(err) console.log(err);
          res.render('teacher/tch_search', {
            title: tpagetitle,
            stulist:sbackmsg,
            classlist:cbackmsg,
            active:'none'
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
/* 新建班级 接口  */
router.post('/klass/new', function(req, res, next) {
  let _user = req.session.user;
  const klassname = req.body.klassname;
  if(klassname && _user.role == 9){
    let classNum = parseInt(_user.classNum);
    Klass.find({'tchlist.teacherid':_user._id}).exec(function(err,classlist){
      if(err) console.log(err)
      if(classlist.length >= classNum){
        res.send({
          status: 'fail',
          msg:'最多只能创建'+classNum+'个班级'
        })
      }else{
        Klass.fetchByName(_user._id,klassname, function(err,backmsg){
          if(err){
            console.log(err);
            res.send({
              status: 'fail',
              msg:'*服务器抢修中，暂时无法创建'
            })
          }else{
            if(backmsg.length == 0){
              let code = nodeUuid.v1().split('-',1).toString();
              let tchlist = [{
                teacherid:_user._id
              }]
              let newClass = new Klass({
                classname:klassname,
                tchlist:tchlist,
                invitecode:code,
                time:moment(new Date()).format("YYYY-MM-DD HH:mm")
              });
              newClass.save(function(err,data){
                if(err) console.log(err);
                res.send({
                  status:'success',
                  msg:data
                })
              })
            }else{
              res.send({
                status:'samename',
                msg:'*班级名称已存在，请重新输入'
              })
            }
          }
        });
      }
    })
  }else{
    res.send({
      status:'somerr',
      msg:'*请重新登录在操作'
    })
  }
});

/* 修改班级名称 接口  */
router.post('/klass/changename', function(req, res, next) {
  let _user = req.session.user;
  const klassname = req.body.klassname;
  const klassid = req.body.klassid;
  if(klassid && klassname && _user.role == 9){
    Klass.fetchByName(_user._id,klassname, function(err,backmsg){
      if(err){
        console.log(err);
        res.send({
          status: 'fail',
          msg:'*服务器抢修中，暂时无法创建'
        })
      }else{
        if(backmsg.length == 0){
          Klass.updateNameById(klassid, klassname, function(err, backmsg2){
            if(err) console.log(err);
            res.send({
              status:'success',
              msg:klassname
            })
          })
        }else{
          res.send({
            status:'samename',
            msg:'*班级名称已存在，请重新输入'
          })
        }
      }
    });
  }else{
    res.send({
      status:'somerr',
      msg:'*请重新登录在操作'
    })
  }
});

/* 删除班级 接口  */
router.post('/klass/delete', function(req, res, next) {
  let _user = req.session.user;
  const klassid = req.body.klassid;
  if(klassid && _user.role == 9){
    Klass.removeById(klassid, function(err){
      if(err){
        console.log(err);
        res.send({
          status: 'fail',
          msg:'*服务器抢修中，暂时无法创建'
        })
      }else{
        res.send({
          status:'success',
          msg:'删除成功'
        })
      }
    });
  }else{
    res.send({
      status:'somerr',
      msg:'*请重新登录在操作'
    })
  }
});

//上传学生excel表
// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名
var save_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/xlsx-upload/')
  },
  filename: function (req, file, cb) {
    let newname = nodeUuid.v1().split('-',1).toString();
    cb(null,   newname + '.xls')
  }
});
// 创建 multer 对象
var savefile = multer({ storage: save_storage });
var save_file = savefile.single('xlsfile');

//上传学生excel表 接口
router.post('/student/add', save_file, function(req, res, next) {
  let _user = req.session.user;
  if(_user && _user.role == 9){
    let file = req.file;
    let tchid = _user._id;
    let stuNum = parseInt(_user.stuNum);
    const file_name = file.filename;
    const classid = req.body.classid;
    Klass.find({_id:classid}).exec(function(err,classList){
      if(classList.length > 0){
        let stuLast = stuNum - classList[0].total;
        if(stuLast > 0){
          let fileroad = './public/xlsx-upload/'+file_name
          const workbook = XLSX.readFile(fileroad);
          const sheetNames = workbook.SheetNames;
          const worksheet = workbook.Sheets[sheetNames[0]];
          const stulist = XLSX.utils.sheet_to_json(worksheet);
          const code = nodeUuid.v1().split('-',1).toString();
          const time = moment(new Date()).format("YYYY-MM-DD HH:mm");
          let stulength = stulist.length;
          let stuTotal = stuLast + 8;
          if(stulength > stuTotal){
            stulength = stuTotal;
          }
          for(let i = 8 ;i < stulength; i++){
            let stumsg = new User({
              username:code + i,
              password:hashpwd('111222'),
              nickname:stulist[i].student,
              realname:stulist[i].student,
              headimg:'/img/headimg/person-icon.png',
              email:'-',
              phoneNum:'-',
              qq:'-',
              wx:'-',
              classlist:[{
                klassid:classid
              }],
              tchlist:[{
                teacherid:tchid
              }],
              time:time,
            })
            stumsg.save(function(err, data){
              if(err) console.log(err);
              let new_notice = new Notice({
                user:data._id,
                message:[{
                  title:'欢迎来到凯智学院',
                  content:'【欢迎来你到凯智学院】很高兴你能成为我们的一员，在这里你将体验不一样的编程乐趣，我们搭载了最新的 scratch3.0，赶紧去体验吧！',
                  createAt:moment(new Date()).format('LL')
                }]
              });
              new_notice.save(function(err){
                if(err){console.log(err)}
                let new_ufans = new Ufollow({
                  userid:data._id,
                });
                new_ufans.save(function(err){
                  if(err){console.log(err)}
                  let addNum = stulength - 8;
                  Klass.updateTotal(classid, addNum, function(err){
                    if(err) console.log(err);
                  })
                  res.send({
                    status: 'success'
                  })
                })
              })
            })
          };

        }else{
          res.send({
            status:'fail',
            msg:'最多'+stuNum+'人'
          })
        }
      }else{
        res.send({
          status:'fail',
          msg:'请先创建班级'
        })
      }
    })
  }
});
//给学生备注
router.post('/student/edit', function(req, res, next) {
  let _user = req.session.user;
  if(_user && _user.role == 9){
    const uid = req.body.uid;
    const remarks = req.body.remarks;
    User.updateremark(uid,remarks,function(err, backmsg){
      if(err){
        console.log(err);
        res.send({
          status:'error',
          msg:'失败'
        })
      }else{
        res.send({
          status:'success',
          msg:'成功'
        })
      }
    })
  }else{
    res.send({
      status:'error',
      msg:'失败'
    })
  }
});
//给学生重置密码
router.post('/student/reset/pwd', function(req, res, next) {
  let _user = req.session.user;
  if(_user && _user.role == 9){
    const uid = req.body.uid;
    const repwd = '4400c84d239d80c2919933c61749e2eaf9d615d5';
    User.updatepwd(uid, repwd, function(err, backmsg){
      if(err){
        console.log(err);
        res.send({
          status:'error',
          msg:'失败'
        })
      }else{
        res.send({
          status:'success',
          msg:'成功'
        })
      }
    })
  }else{
    res.send({
      status:'error',
      msg:'失败'
    })
  }
});
//将学生移出班级
router.post('/student/removestu', function(req, res, next) {
  let _user = req.session.user;
  if(_user && _user.role == 9){
    const uid = req.body.uid;
    const cid = req.body.cid;
    User.updateOutclass(uid,cid,function(err){
      if(err){
        console.log(err);
        res.send({
          status:'error',
          msg:'失败'
        })
      }else{
        Klass.updateDownTotal(cid,function(err){
          if(err) console.log(err)
        })
        res.send({
          status:'success',
          msg:'成功'
        })
      }
    })
  }else{
    res.send({
      status:'error',
      msg:'失败'
    })
  }
});
//删除学生账号
router.post('/student/delete/stu', function(req, res, next) {
  let _user = req.session.user;
  if(_user && _user.role == 9){
    const uid = req.body.uid;
    const cid = req.body.cid;
    console.log(cid)
    User.remove({_id:uid}).exec(function(err){
      if(err){
        console.log(err);
        res.send({
          status:'error',
          msg:'失败'
        })
      }else{
        if(cid !== 'noclass'){
          Klass.updateDownTotal(cid,function(err){
            if(err) console.log(err)
          })
        }
        res.send({
          status:'success',
          msg:'成功'
        })
      }
    })
  }else{
    res.send({
      status:'error',
      msg:'失败'
    })
  }
});

//查询所有班级
router.get('/class/all', function(req, res, next) {
  let _user = req.session.user;
  if(_user && _user.role == 9){
    Klass.findBytchid(_user._id, function(err,backmsg){
      if(err) console.log(err)
      res.send({
        status:'success',
        classlist:backmsg
      })
    })
  }else{
    res.send({
      status:'error',
      msg:'班级列表获取失败'
    })
  }
});
//查询班级学生
router.post('/class/students', function(req, res, next) {
  let _user = req.session.user;
  let classid = req.body.classid;
  if(_user && classid && _user.role == 9){
    User.fetchByclassid(classid, function(err,studata){
      if(err) console.log(err)
      res.send({
        status:'success',
        stulist:studata
      })
    })
  }else{
    res.send({
      status:'error',
      msg:'学生列表获取失败'
    })
  }
});
//添加校内学生
router.post('/add/oldstu', function(req, res, next) {
  let _user = req.session.user;
  let classid = req.body.classid;
  let stulist = req.body.stulist;
  if(_user && classid && _user.role == 9 && stulist){
    let stuNum = parseInt(_user.stuNum);
    Klass.find({_id:classid}).exec(function(err, classList){
      if(classList.length > 0){
        let stuLast = stuNum - classList[0].total;
        if(stuLast > 0){
          let _stulist = stulist.split('-');
          User.fetchByclassid(classid, function(err,studata){
            if(err) console.log(err)
            let haslist = [];
            if(studata.length > 0){
              for(let i = 0; i < studata.length; i++){
                for(let j = 0; j < _stulist.length; j++){
                  if(studata[i]._id == _stulist[j]){
                    _stulist.splice(j,1);
                    j = j -1
                  }
                }
              }
            }
            let addLength = _stulist.length;
            if(addLength > stuLast){
              addLength = stuLast;
            }
            if(addLength > 0){
              for(let i = 0; i < addLength; i++){
                User.updateInclass(_stulist[i],_user._id, classid, function(err){
                  if(err) console.log(err)
                })
              }
              Klass.updateTotal(classid, addLength, function(err){
                if(err) console.log(err);
              })
              res.send({
                status:'success',
                msg:'成功'
              })
            }else{
              res.send({
                status:'error',
                msg:'学生已存在'
              })
            }
          })
        }else{
          res.send({
            status:'fail',
            msg:'最多'+stuNum+'人'
          })
        }
      }
    })
  }else{
    res.send({
      status:'error',
      msg:'添加失败'
    })
  }
});
//导出学生信息
router.post('/download/stumsg', function(req, res, next) {
  let _user = req.session.user;
  let classid = req.body.classid;
  if(_user && classid && _user.role == 9){
    User.fetchByclassid(classid, function(err,studata){
      if(err){
        console.log(err);
        res.send({
          status:'error',
          msg:'导出失败'
        })
      }else{
        if(studata.length > 0){
          let _headers = ['realname','username'];
          let cnheader = { A1: { v: '学生姓名' }, B1: { v: '账号' } };
          var headers = _headers.map((v, i) => Object.assign({}, {v: v, position: String.fromCharCode(65+i) + 1 })).reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {});
          let _studata = studata.map((v, i) => _headers.map((k, j) => Object.assign({}, { v: v[k], position: String.fromCharCode(65+j) + (i+2) }))).reduce((prev, next) => prev.concat(next)).reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {});
          // 合并 cnheader 和 _studata
          var output = Object.assign({}, cnheader, _studata);
          // 获取所有单元格的位置
          var outputPos = Object.keys(output);
          // 计算出范围
          var ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
          // 构建 workbook 对象
          var wb = {
            SheetNames: ['学生表'],
            Sheets: {
                '学生表': Object.assign({}, output, { '!ref': ref })
            }
          };
          const xlsname = nodeUuid.v1().split('-',1).toString();
          const filename = '/xlsx-out/'+xlsname+'.xlsx';
          // 导出 Excel
          XLSX.writeFile(wb, 'public'+filename);
          res.send({
            status:'success',
            msg:filename
          })
        }else{
          res.send({
            status:'error',
            msg:'数据为空'
          })
        }
      }
    })
  }else{
    res.send({
      status:'error',
      msg:'请重新登录在操作'
    })
  }
});
//查询班级学生
router.get('/noclass/students', function(req, res, next) {
  let _user = req.session.user;
  if(_user && _user.role == 9){
    User.fetchBynoclassid(function(err,studata){
      if(err) console.log(err)
      res.send({
        status:'success',
        stulist:studata
      })
    })
  }else{
    res.send({
      status:'error',
      msg:'学生列表获取失败'
    })
  }
});
//发布作业
router.post('/task/released', function(req, res, next) {
  let _user = req.session.user;
  let newtask = req.body.task;
  let _newtask = JSON.parse(newtask);
  if(_user && _user.role == 9){
    if(_newtask.types && _newtask.title && _newtask.content && _newtask.workNum && _newtask.endtime && _newtask.classlist.length > 0){
        let _inserttask = new Task({
          types: _newtask.types,
          title: _newtask.title,
          content: _newtask.content,
            video: _newtask.video,
          creater: _user._id,
          classlist: _newtask.classlist,
          isrelesed:_newtask.btntype,
          endtime:_newtask.endtime,
          time:moment(new Date()).format("YYYY-MM-DD HH:mm"),
          worksNum: _newtask.workNum,
          templet:_newtask.widlist
        });
        _inserttask.save(function(err,data){
          if(err) console.log(err);
          res.send({
            status:'success',
            msg:'成功'
          })
        })
    }
  }else{
    res.send({
      status:'error',
      msg:'请重新登录在操作'
    })
  }
});
//修改已发布作业
router.post('/task/released/change', function(req, res, next) {
  let _user = req.session.user;
  let newtask = req.body.task;
  let tid = req.body.tid;
  let _newtask = JSON.parse(newtask);
  if(_user && _user.role == 9){
    if(tid && _newtask.types && _newtask.title && _newtask.content && _newtask.workNum && _newtask.endtime && _newtask.classlist.length > 0){
        let _inserttask = {
          types: _newtask.types,
          title: _newtask.title,
          content: _newtask.content,
            video:_newtask.video,
          creater: _user._id,
          classlist: _newtask.classlist,
          isrelesed:_newtask.btntype,
          endtime:_newtask.endtime,
          time:moment(new Date()).format("YYYY-MM-DD HH:mm"),
          worksNum: _newtask.workNum,
          templet:_newtask.widlist
        };
        Task.find({_id:tid}).exec(function(err,data){
          if(err) console.log(err);
          var _taskmsg = _.extend(data[0],_inserttask)
          _taskmsg.save(function(err,data){
            if(err) console.log(err);
            res.send({
              status:'success',
              msg:'成功'
            })
          })
        })
    }
  }else{
    res.send({
      status:'error',
      msg:'请重新登录在操作'
    })
  }
});
//加入其他班级
router.post('/join/otherclass', function(req, res, next) {
  let _user = req.session.user;
  let bjm = req.body.bjm;
  console.log(bjm)
  if(_user && _user.role == 0 && bjm){
    Klass.find({invitecode:bjm}).exec(function(err,data){
      if(err) console.log(err);
      if(data && data.length > 0){
        let _classList = _user.classlist, _classid = data[0]._id, isindex = 0;
        for (var i = _classList.length - 1; i >= 0; i--) {
          if(_classList[i].klassid._id == _classid){
            isindex = 1;
            break;
          }
        }
        if(isindex == 0){
          User.updateInclass(_user._id,data[0].tchlist[0].teacherid,data[0]._id,function(err,backmsg){
            if(err) console.log(err);
            let stuTotal = 1;
            Klass.updateTotal(_classid, stuTotal, function(err){
              if(err) console.log(err)
            });
            User.find({_id:_user._id}).populate('classlist.klassid','classname').exec(function(err, usermsg){
              if(err) console.log(err);
              req.session.user = usermsg[0];
              res.send({
                status:'success',
                msg:data
              })
            })
          })
        }else{
          res.send({
            status:'fail',
            msg:'已加入当前班级'
          })
        }

      }else{
        res.send({
          status:'fail',
          msg:'班级码有误，班级不存在'
        })
      }
    })
  }else{
    res.send({
      status:'error',
      msg:'请重新登录在操作'
    })
  }
});
//获得作品信息
router.post('/find/workinfo', function(req, res, next) {
  let _user = req.session.user;
  let wid = req.body.wid;
  if(_user && wid){
    TchWorks.find({_id:wid}).exec(function(err,wdata){
      if(err){
        console.log(err)
        res.send({
          status:'fail',
          msg:'获取评分失败'
        })
      }else{
        res.send({
          status:'success',
          msg:wdata[0]
        })
      }

    })
  }else{
    res.send({
      status:'error',
      msg:'请重新登录在操作'
    })
  }
});
//作品评分
router.post('/works/pf/post', function(req, res, next) {
  let _user = req.session.user;
  let wid = req.body.wid;
  let xstatus = req.body.xstatus;
  let dfnum = req.body.dfnum;
  let dfcont = req.body.dfcont;
  if(_user && _user.role == 9 && wid && xstatus && dfnum && dfcont){
    TchWorks.updatePfById(wid,xstatus,dfnum,dfcont,function(err,wdata){
      if(err){
        console.log(err)
        res.send({
          status:'fail',
          msg:'评分失败'
        })
      }else{
        res.send({
          status:'success',
          msg:'评分成功'
        })
      }

    })
  }else{
    res.send({
      status:'error',
      msg:'请重新登录在操作'
    })
  }
});
module.exports = router;
