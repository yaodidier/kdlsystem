const express = require('express');
const crypto = require('crypto');
const multer  = require('multer');
const Banner = require('../models/banner');
const Works = require('../models/works');
const User = require('../models/user');
const Suggest = require('../models/suggest');
const FeedBack = require('../models/feedback');
const Notice = require('../models/notice');
const Ucomment = require('../models/ucomment');
const Wcomment = require('../models/wcomment');
const Lcomment = require('../models/lcomment');
const UCommentip = require('../models/tip_comment_u');
const WCommentip = require('../models/tip_comment_w');
const LCommentip = require('../models/tip_comment_l');
const Worktip = require('../models/tip_work');
const Usertip = require('../models/tip_user');
const Lesson = require('../models/lesson');
const Adminuser = require('../models/admin_user');
const Klass = require('../models/tch_class');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const moment = require('moment');
moment.locale('zh-CN');

/* GET 后台首页. */
router.get('/index', function(req, res, next) {
  let _admin = req.session.admin;
  if(_admin){
    Works.find({}).count().exec(function(err , worknum){
      User.find({}).count().exec(function(err , usernum){
        Banner.find({}).exec(function(err , index_msg){
          if(err){console.log(err)}
          res.render('admin/index', {
            banners:index_msg,
            usernum:usernum,
            worknum:worknum,
            active:'index'
          });
        })
      })
    })
  }else{
    res.redirect('/admin/login')
  }
});
// 登录
router.get('/login', function(req, res, next) {
  	res.render('admin/login');
});
// 开设新管理员账号
router.get('/register', function(req, res, next) {
  let _admin = req.session.admin;
  if(_admin){
    res.locals.admin = _admin
  }
  if(_admin){
  	res.render('admin/register',{
      active:'register'
    });
  }else{
    res.redirect('/admin/login')
  }
  // res.render('admin/register',{
  //   active:'register'
  // });
});

// 问题反馈
router.get('/feedback', function(req, res, next) {
  let _admin = req.session.admin;
  if(_admin){
    FeedBack.find({}).sort({'meta.createAt': -1}).populate('user','_id nickname').exec(function(err, feedback){
      if(err){console.log(err)}
      res.render('admin/feedback',{
        active:'feedback',
        feedback:feedback
      })
    })
  }else{
    res.redirect('/admin/login')
  }
});
// 意见反馈
router.get('/suggest', function(req, res, next) {
  let _admin = req.session.admin;
  if(_admin){
    Suggest.find({}).sort({'meta.createAt': -1}).populate('user','_id nickname').exec(function(err, suggest){
      if(err){console.log(err)}
      res.render('admin/suggest',{
        active:'suggest',
        suggest:suggest
      })
    })
  }else{
    res.redirect('/admin/login')
  }
});

// 搜索用户
router.get('/searchuser', function(req, res, next) {
  let _admin = req.session.admin;
  if(_admin){
    res.render('admin/search_user',{
      active:'searchuser'
    })
  }else{
    res.redirect('/admin/login')
  }
});
// 视频列表
router.get('/lesson', function(req, res, next) {
  let _admin = req.session.admin;
  if(_admin){
    Lesson.find({}).exec(function(err, lessonlist){
      if(err){console.log(err)}
      res.render('admin/lesson', { 
        lessons:lessonlist,
        active:'lesson'
      });
    })
  }else{
    res.redirect('/admin/login')
  }
});
// 上传新视频
router.get('/lesson/upload/new', function(req, res, next) {
  let _admin = req.session.admin;
  if(_admin){
    res.render('admin/lesson_upload', { 
      lessons:[],
      active:'lesson'
    });
  }else{
    res.redirect('/admin/login')
  }
});
//更新视频
router.get('/lesson/upload/:id', function(req, res, next) {
  let _admin = req.session.admin;
  if(_admin){
    let vid = req.params.id;
    Lesson.find({_id:vid}).exec(function(err, backdata){
      if(backdata && backdata.length > 0){
        res.render('admin/lesson_upload', { 
          lessons:backdata[0],
          active:'lesson'
        });
      }else{
        res.redirect('/admin/lesson')
      }
    })
  }else{
    res.redirect('/admin/login')
  }
});
// 被举报作品
router.get('/tips/work', function(req, res, next) {
  let _admin = req.session.admin;
  if(_admin){
    Worktip.find({}).sort({'meta.createAt': -1}).exec(function(err, tips){
      res.render('admin/tips_2', { 
        tips:tips,
        qf:'work',
        active:'tips'
      });
    })
  }else{
    res.redirect('/admin/login')
  }
});
// 被举报用户
router.get('/tips/user', function(req, res, next) {
  let _admin = req.session.admin;
  if(_admin){
    Usertip.find({}).sort({'meta.createAt': -1}).exec(function(err, tips){
      res.render('admin/tips_2', { 
        tips:tips,
        qf:'user',
        active:'tips'
      });
    })
  }else{
    res.redirect('/admin/login')
  }
});

// 举报用户主页-评论
router.get('/tips/comment/user', function(req, res, next) {
  let _admin = req.session.admin;
  if(_admin){
    UCommentip.find({}).sort({'meta.createAt': -1}).populate('toid','_id content').exec(function(err, tips){
      res.render('admin/tips', { 
        tips:tips,
        qf:'user',
        active:'tips'
      });
    })
  }else{
    res.redirect('/admin/login')
  }
});
// 举报作品详情-评论
router.get('/tips/comment/work', function(req, res, next) {
  let _admin = req.session.admin;
  if(_admin){
    WCommentip.find({}).sort({'meta.createAt': -1}).populate('toid','_id content').exec(function(err, tips){
      res.render('admin/tips', { 
        tips:tips,
        qf:'work',
        active:'tips'
      });
    })
  }else{
    res.redirect('/admin/login')
  }
});
// 举报视频详情-评论
router.get('/tips/comment/lesson', function(req, res, next) {
  let _admin = req.session.admin;
  if(_admin){
    LCommentip.find({}).sort({'meta.createAt': -1}).populate('toid','_id content').exec(function(err, tips){
      res.render('admin/tips', { 
        tips:tips,
        qf:'lesson',
        active:'tips'
      });
    })
  }else{
    res.redirect('/admin/login')
  }
});
//删除作品路由
router.get('/works', function(req, res, next) {
  let _admin = req.session.admin;
  if(_admin){
    res.render('admin/works', { 
      active:'works'
    });
  }else{
    res.redirect('/admin/login')
  }
});

//以下是校园
// 教师列表
router.get('/teacher/reg', function(req, res, next) {
  let _admin = req.session.admin;
  if(_admin){
    res.render('admin/teacher_reg', {
      active:'teacher_reg'
    });
  }else{
    res.redirect('/admin/login')
  }
});
// 教师列表
router.get('/tchlist', function(req, res, next) {
  let _admin = req.session.admin;
  if(_admin){
    User.find({role:9}).sort({'meta.createAt': -1}).exec(function(err, tchList){
      if(err){console.log(err)}
      res.render('admin/tch_list',{
        active:'tchlist',
        data:tchList
      })
    })
  }else{
    res.redirect('/admin/login')
  }
});
// 班级列表
router.get('/classlist', function(req, res, next) {
  let _admin = req.session.admin;
  if(_admin){
    Klass.find({}).sort({'meta.createAt': -1}).populate('tchlist.teacherid','nickname').exec(function(err, classList){
      if(err){console.log(err)}
      res.render('admin/classlist',{
        active:'classlist',
        data:classList
      })
    })
  }else{
    res.redirect('/admin/login')
  }
});
// 学生列表
router.get('/stulist', function(req, res, next) {
  let _admin = req.session.admin;
  if(_admin){
    User.find({role:0}).sort({classlist:-1}).populate('tchlist.teacherid','nickname').populate('classlist.klassid','classname').exec(function(err, stualldata){
      res.render('admin/stulist', { 
        stulist: stualldata,
        active:'stulist'
      });
    })
  }else{
    res.redirect('/admin/login')
  }
});
/*  教师 regsiter  */
router.post('/teacher/register', function(req, res, next) {
  const userhash = crypto.createHash('sha1');
  const user_name = req.body.username;
  const nick_name = '小幽老师';
  const user_pwd = req.body.userpwd;
  const classNum = req.body.classnum;
  const stuNum = req.body.stunum;
  let _teachermsg;
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
          _teachermsg = new User({
            username: user_name,
            password: hash_pwd,
            nickname: nick_name,
            realname:'',
            headimg:'/img/headimg/person-icon.png',
            email:'',
            phoneNum:'',
            qq:'',
            wx:'',
            classNum:classNum,
            stuNum:stuNum,
            role:9
          });
          _teachermsg.save(function(err,data){
            if (err) {
              console.log(err);
              res.send({
                status: 'fail'
              })
            }else{
              res.send({
                status: 'success'
              })
            }
          })
        }else{
          res.send({
            status: 'fail',
            msg:'该账号已被注册'
          })
        }
      }
    })
  }
});
// 修改教师基本信息
router.post('/change/tch/base', function(req, res, next) {
  let _admin = req.session.admin;
  if(_admin){
    let id = req.body.id;
    let name = req.body.name;
    let classNum = req.body.classnum;
    let stuNum = req.body.stunum;
    User.update({_id:id},{$set:{nickname:name,classNum:classNum,stuNum:stuNum}}).exec(function(err, tips){
      if(err){
        console.log(err)
      }
      res.send({
        status: 'success'
      })
    })
  }else{
    res.send({
      status: 'fail',
      msg:'请重新登录后台'
    })
  }
});
// 修改教师密码
router.post('/change/tch/password', function(req, res, next) {
  let _admin = req.session.admin;
  if(_admin){
    const userhash = crypto.createHash('sha1');
    let id = req.body.id;
    let pwd = req.body.password;
    const hash_pwd = userhash.update('xiaou').update(pwd).digest('hex');
    User.update({_id:id},{$set:{password:hash_pwd}}).exec(function(err, tips){
      if(err){
        console.log(err)
      }
      res.send({
        status: 'success'
      })
    })
  }else{
    res.send({
      status: 'fail',
      msg:'请重新登录后台'
    })
  }
});
// 封号
router.post('/change/tch/role/fh', function(req, res, next) {
  let _admin = req.session.admin;
  if(_admin){
    let id = req.body.id;
    User.update({_id:id},{$set:{status:-1}}).exec(function(err, tips){
      if(err){
        console.log(err)
      }
      res.send({
        status: 'success'
      })
    })
  }else{
    res.send({
      status: 'fail',
      msg:'请重新登录后台'
    })
  }
});

// 解封号
router.post('/change/tch/role/jf', function(req, res, next) {
  let _admin = req.session.admin;
  if(_admin){
    let id = req.body.id;
    User.update({_id:id},{$set:{status:0}}).exec(function(err, tips){
      if(err){
        console.log(err)
      }
      res.send({
        status: 'success'
      })
    })
  }else{
    res.send({
      status: 'fail',
      msg:'请重新登录后台'
    })
  }
});
// 以下是接口
//重置用户密码
router.post('/change/user/pwd', function(req, res, next) {
  let _admin = req.session.admin;
  const userhash = crypto.createHash('sha1');
  const hash_pwd = userhash.update('xiaou').update('111111').digest('hex');
  const uid = req.body.uid;
  if(_admin && uid){
    User.updateOne({_id:uid},{$set:{password:hash_pwd}}).exec(function(err){
      res.send({
        status: 'success'
      })
    })
  }else{
    res.send({
      status:'fail'
    })
  }
});
/*  login 接口  */
router.post('/signin', function(req, res, next) {
  const userhash = crypto.createHash('sha1');
  const user_name = req.body.username;
  const user_pwd = req.body.password;
  if(user_name && user_pwd){
  	const hash_pwd = userhash.update('s1_admin').update(user_pwd).digest('hex');
  	Adminuser.fetchByName(user_name, function(err,usermsg){
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
              req.session.admin = usermsg[0];
              res.send({
                status:'success'
              })
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
/*  regsiter 接口 */
router.post('/register', function(req, res, next) {
  const userhash = crypto.createHash('sha1');
  const user_name = req.body.username;
  const user_pwd = req.body.userpwd;
  let _usermsg;
  if(user_name && user_pwd){
  	const hash_pwd = userhash.update('s1_admin').update(user_pwd).digest('hex');
    Adminuser.fetchByName(user_name, function(err, data){
      if(err){
        console.log(err);
        res.send({
          	status: 'fail',
            msg:'服务器抢修中，暂时无法注册'
        })
      }else{
        if(data.length == 0){
          _usermsg = new Adminuser({
           	username: user_name,
           	password: hash_pwd
          });
          _usermsg.save(function(err,data){
            if (err) {
            	console.log(err);
            	res.send({
              		status: 'fail'
            	})
            }else{
              res.send({
              	status: 'success'
              })
            }
          })
        }else{
        	res.send({
	          	status: 'fail',
	            msg:'该账号已被注册'
        	})
        }
      }
    })
  }
});
// logout 接口
router.get('/logout', function(req, res, next) {
  delete req.session.admin;
  res.redirect('/admin/login')
});
// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/img/index/banner'); 
    },
    filename: function (req, file, cb) {
    	cb(null, file.fieldname + '-' + guid())
    }
});

function guid() {
    function S4() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4()+S4());
}
// 创建 multer 对象
var upload = multer({ storage: storage });

/* 轮播上传 接口 */
router.post('/banner/uploads', upload.single('bannerimg'),function(req, res, next) {
	let file = req.file;
	const file_name = file.filename;
	const file_title = req.body.imgtitle;
	const status_id = req.body.status;
	const urls = req.body.bannerurl;
	banner_msg = {
		title:file_title,
		src:file_name,
		url:urls
	}
	if(file_title && file_name){
		if(status_id == 'new'){
			let indexmsg = new Banner({
				title:file_title,
				src:file_name,
				url:urls
			})
			indexmsg.save(function(err){
				if(err) console.log(err)
				res.send({
			        status: 'success'
			    })
			})

		}else{
			Banner.changeBanner(status_id,banner_msg, function(err, back_msg){
		      if(err){console.log(err)}
		      res.send({
		        status: 'success'
		      })
		    })
		}
		
	}else{
		res.send({
			status:'fail'
		})
	}
});
// 轮播删除接口
router.post('/banner/delete',function(req, res, next) {
	let imgid = req.body.imgid;
	
	if(imgid){
		Banner.remove({_id:imgid}).exec(function(err){
	      if(err){console.log(err)}
			res.send({
				status: 'success'
			})
	    })

	}else{
		res.send({
			status:'fail'
		})
	}
});
// 搜索用户接口
router.post('/search/user',function(req, res, next) {
  let userid = req.body.userid;
  if(userid){
    User.find({username:userid}).exec(function(err,userinfo){
      if(err){console.log(err)}
      if(!userinfo || userinfo.length == 0){
        res.send({
          status:'fail'
        })
      }else{
        res.send({
          status: 'success',
          userinfo:userinfo
        })
      }
      
    })
  }else{
    res.send({
      status:'fail'
    })
  }
});
// 搜索用户昵称接口
router.post('/search/nickname',function(req, res, next) {
  let nickname = req.body.nickname;
  if(nickname){
    User.find({nickname:nickname}).exec(function(err,userinfo){
      if(err){console.log(err)}
      if(!userinfo || userinfo.length == 0){
        res.send({
          status:'fail'
        })
      }else{
        res.send({
          status: 'success',
          userinfo:userinfo
        })
      }
      
    })
  }else{
    res.send({
      status:'fail'
    })
  }
});
// 推送功能——给个人接口
router.post('/tuisong/user',function(req, res, next) {
  let userid = req.body.userid;
  let title = req.body.title;
  let content = req.body.content;
  let zn_msg = {
    title:title,
    content:content,
    createAt:moment(new Date()).format('LL')
  }
  if(userid && content && title){
    Notice.updateNotice(userid,zn_msg,function(err){
      if(err){console.log(err)}

      User.updateOnenotice(userid,function(err){
        if(err){console.log(err)}
        res.send({
          status: 'success',
        })
      })

    })
  }else{
    res.send({
      status:'fail'
    })
  }
});
// 推送功能——给所有用户 接口
router.post('/tuisong/all',function(req, res, next) {
  let title = req.body.title;
  let content = req.body.content;
  let ts_msg = {
    title:title,
    content:content,
    createAt:moment(new Date()).format('LL')
  }
  if(content && title){
    Notice.tsAll(ts_msg, function(err){
      if(err){console.log(err)}
      User.updateAllnotice(function(err){
        if(err){console.log(err)}
        res.send({
          status: 'success',
        })
      })
    })
  }else{
    res.send({
      status:'fail'
    })
  }
});
// 封号接口
router.post('/fenhao/user',function(req, res, next) {
  let userid = req.body.userid;
  if(userid){
    User.findOne({_id:userid}).exec(function(err,user_msg){
      if(user_msg){
        if(user_msg.status == 9){
          User.update({_id:userid},{$set:{status:-2}}).exec(function(err){
            if(err){console.log(err)}
            res.send({
              status: 'success'
            })
          })
        }else{
          User.update({_id:userid},{$set:{status:-1}}).exec(function(err){
            if(err){console.log(err)}
            res.send({
              status: 'success'
            })
          })
        }
      }else{
        res.send({
          status:'fail'
        })
      }
    })
  }else{
    res.send({
      status:'fail'
    })
  }
});
// 解封号接口
router.post('/jiefenhao/user',function(req, res, next) {
  let userid = req.body.userid;
  if(userid){
    User.findOne({_id:userid}).exec(function(err,user_msg){
      if(user_msg){
        if(user_msg.status == -2){
          User.update({_id:userid},{$set:{status:9}}).exec(function(err){
            if(err){console.log(err)}
            res.send({
              status: 'success'
            })
          })
        }else{
          User.update({_id:userid},{$set:{status:0}}).exec(function(err){
            if(err){console.log(err)}
            res.send({
              status: 'success'
            })
          })
        }
      }else{
        res.send({
          status:'fail'
        })
      }
    })
  }else{
    res.send({
      status:'fail'
    })
  }
});
// 视频上传接口
var videostorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/img/videocover'); 
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + guid())
    }
});
// 创建 视频 multer 对象
var videoupload = multer({ storage: videostorage });
router.post('/lesson/video', videoupload.single('videocovers'),function(req, res, next) {
  let file = req.file;
  const covers = file.filename;
  const _id = req.body.id;
  const _oldcovers = req.body.oldcovers;
  const title = req.body.title;
  const abstract = req.body.abstract;
  const knowsome = req.body.knowsome;
  const learnsome = req.body.learnsome;
  const src = req.body.src;
  videofiles = {
    title:title,
    abstract:abstract,
    knowsome:knowsome,
    learnsome:learnsome,
    covers:covers,
    src:src
  }
  if(covers && title){
    if(_id == 'new'){
      let _videofiles = new Lesson(videofiles);
      _videofiles.save(function(err){
        if(err) console.log(err)
        res.send({
          status: 'success'
        })
      })
    }else{
      fs.unlink('./public/img/videocover/'+ _oldcovers, function (err) {
        if (err){
          console.log(err)
        }
      })
      Lesson.updateVideo(_id, videofiles, function(err){
        if(err){console.log(err)}
        res.send({
          status: 'success'
        })
      })
    }
  }else{
    res.send({
      status:'fail',
      msg:'标题或封面不能为空'
    })
  }
});
// 轮播删除接口
router.post('/lessons/delete',function(req, res, next) {
  let lid = req.body.lid;
  let _coversname = req.body.coversname;
  if(lid && _coversname){
    Lesson.remove({_id:lid}).exec(function(err){
      if(err){console.log(err)}
      res.send({
        status: 'success'
      })
      fs.unlink('./public/img/videocover/'+ _coversname, function (err) {
        if (err){
          console.log(err)
        }
      })
    })
  }else{
    res.send({
      status:'fail'
    })
  }
});
//修改密码
router.post('/change/pwd',function(req, res, next) {
  const userhash = crypto.createHash('sha1');
  let userid = req.body.userid;
  let oldpwd = req.body.oldpwd;
  let newpwd = req.body.newpwd;
  const hash_pwd = userhash.update('s1_admin').update(oldpwd).digest('hex');
  
  if(userid && oldpwd && newpwd){
    Adminuser.fetchById(userid, function(err,usermsg){
      if(err){
        console.log(err);
          res.send({
            status: 'fail',
            msg:'服务器抢修中，暂时无法修改'
          })
      }else{
        if(hash_pwd == usermsg[0].password){
          const userhash2 = crypto.createHash('sha1');
          const new_hash_pwd = userhash2.update('s1_admin').update(newpwd).digest('hex');
          Adminuser.updateById(userid, new_hash_pwd, function(err,usermsg){
            if(err) console.log(err)
            res.send({
              status:'success'
            })
          })
        }else{
          res.send({
            status:'pwderror',
            msg:'旧密码错误',
          })
        }
      }
    });
  }else{
    res.send({
      status:'fail'
    })
  }
});
//作品删除接口
router.post('/works/delete',function(req, res, next) {
  let wid = req.body.wid;
  if(wid){
    Works.remove({_id:wid}).exec(function(err){
      if(err){console.log(err)}
      res.send({
        status: 'success'
      })
    })
  }else{
    res.send({
      status:'fail'
    })
  }
});
//作品查询
router.post('/search/work',function(req, res, next) {
  let wid = req.body.wid;
  if(wid){
    Works.find({_id:wid}).exec(function(err,works){
      if(err){console.log(err)}
      if(!works || works.length == 0){
        res.send({
          status: 'fail',
          msg:'作品不存在或已被删除'
        })
      }else{
        res.send({
          status: 'success',
          works:works[0]
        })
      }
      
    })
  }else{
    res.send({
      status:'fail',
       msg:'查询错误'
    })
  }
});


//删除用户评论
router.post('/delete/ucomment/f', function(req, res, next) {
  const cid = req.body.cid;
  const tipid = req.body.tipid;
  if(cid){
    Ucomment.deleteFById(cid, function(err) {
      if(err){
        res.send({
          status:'fail'
        })
      }else{
        res.send({
          status:'success'
        })
        UCommentip.removeById(tipid, function(err){
          if(err) console.log(err)
        })
      }
    })
  }else{
    res.send({
      status:'fail'
    })
  }
});
router.post('/delete/ucomment/s', function(req, res, next) {
  const cid = req.body.cid;
  const types = req.body.types;
  const tid = req.body.tid;
  const tipid = req.body.tipid;
  if(cid && tid && types=='sucom'){
    Ucomment.deleteSById(cid,tid, function(err) {
      if(err){
        console.log(err)
        res.send({
          status:'fail'
        })
      }else{
        res.send({
          status:'success'
        })
        UCommentip.removeById(tipid, function(err){
          if(err) console.log(err)
        })
      }
    })
  }else{
    res.send({
      status:'fail'
    })
  }
});
//作品页评论删除
router.post('/delete/wcomment/f', function(req, res, next) {
  const cid = req.body.cid;
  const tipid = req.body.tipid;
  if(cid){
    Wcomment.deleteFById(cid, function(err) {
      if(err){
        res.send({
          status:'fail'
        })
      }else{
        res.send({
          status:'success'
        })
        WCommentip.removeById(tipid, function(err){
          if(err) console.log(err)
        })
      }
    })
  }else{
    res.send({
      status:'fail'
    })
  }
});
router.post('/delete/wcomment/s', function(req, res, next) {
  const cid = req.body.cid;
  const types = req.body.types;
  const tid = req.body.tid;
  const tipid = req.body.tipid;
  if(cid && tid && types=='swcom'){
    Wcomment.deleteSById(cid,tid, function(err) {
      if(err){
        console.log(err)
        res.send({
          status:'fail'
        })
      }else{
        res.send({
          status:'success'
        })
        WCommentip.removeById(tipid, function(err){
          if(err) console.log(err)
        })
      }
    })
  }else{
    res.send({
      status:'fail'
    })
  }
});
//课程页评论删除
router.post('/delete/lcomment/f', function(req, res, next) {
  const cid = req.body.cid;
  const tipid = req.body.tipid;
  if(cid){
    Lcomment.deleteFById(cid, function(err) {
      if(err){
        res.send({
          status:'fail'
        })
      }else{
        res.send({
          status:'success'
        })
        LCommentip.removeById(tipid, function(err){
          if(err) console.log(err)
        })
      }
    })
  }else{
    res.send({
      status:'fail'
    })
  }
});
router.post('/delete/lcomment/s', function(req, res, next) {
  const cid = req.body.cid;
  const types = req.body.types;
  const tid = req.body.tid;
  const tipid = req.body.tipid;
  if(cid && tid && types=='slcom'){
    Lcomment.deleteSById(cid,tid, function(err) {
      if(err){
        console.log(err)
        res.send({
          status:'fail'
        })
      }else{
        res.send({
          status:'success'
        })
        LCommentip.removeById(tipid, function(err){
          if(err) console.log(err)
        })
      }
    })
  }else{
    res.send({
      status:'fail'
    })
  }
});


// 处理举报作品
router.post('/tips/work/done', function(req, res, next) {
  const wid = req.body.wid;
  if(wid){
    Worktip.updateById(wid, function(err) {
      if(err){
        console.log(err)
        res.send({
          status:'fail'
        })
      }else{
        res.send({
          status:'success'
        })
      }
    })
  }else{
    res.send({
      status:'fail'
    })
  }
});
// 处理举报用户
router.post('/tips/user/done', function(req, res, next) {
  const wid = req.body.wid;
  if(wid){
    Usertip.updateById(wid, function(err) {
      if(err){
        console.log(err)
        res.send({
          status:'fail'
        })
      }else{
        res.send({
          status:'success'
        })
      }
    })
  }else{
    res.send({
      status:'fail'
    })
  }
});
module.exports = router;