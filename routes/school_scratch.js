const express = require('express');
const Unrel = require('../models/unreleased');
const TchWorks = require('../models/tch_works');
const User = require('../models/user');
const Task = require('../models/tch_task');
const path = require('path');
const fs = require('fs');
const multer  = require('multer');
const router = express.Router();
const moment = require('moment');
moment.locale('zh-CN');

let pagetitle = 'Scratch3.0创作';
function guid() {
    function S4() {
       return (((1+Math.random())*0x10000)|0).toString().substring(1);
    }
    return (S4()+S4());
}

/* GET scratch 3.0 page. */
router.get('/', function(req, res, next) {
	let _user = req.session.user;
  if(_user){
    res.locals.user = _user;
    let userId = res.locals.user._id;
    res.render('teacher/scratch', { 
	    title: pagetitle
	  });
  }else{
  	res.redirect('error')
  }
});

//创建文件夹
var createFolder = function(folder){
  try{
    fs.accessSync(folder); 
  }catch(e){
    fs.mkdirSync(folder);
  }  
};

function copy(src, dst) {
  fs.writeFileSync(dst, fs.readFileSync(src));
}
function main(argv0,argv1) {
	copy(argv0, argv1);
}
/* POST 提交作业接口 */
router.post('/stuwork/post/new', function(req, res, next) {
	let _user = req.session.user;
	if(_user && _user.role == 0){
		const title = req.body.title;
		const localname = req.body.localname
		const covers = req.body.covers;
		let classlist = req.body.classlist;
		classlist = classlist.split(',')
		const taskid = req.body.taskid;
		let classList = [];
		let filesrc1 = './public/unreleased/scratch/';
		let coversrc1 = './public/unreleased/covers/';
		let filesrc2 = './public/teacher-pro/scratch/'+_user._id;
		let coversrc2 = './public/teacher-pro/covers/'+_user._id;
		createFolder(filesrc2);
		createFolder(coversrc2);
		let newfilename = guid() + Date.now();
		main(filesrc1+localname, filesrc2+'/'+newfilename);
		main(coversrc1+covers, coversrc2+'/'+newfilename);
		for(let i = 0;i < classlist.length; i++){
			classList.push({
				classid:classlist[i]
			})
		}
		let newwork = new TchWorks({
			stuid:_user._id,
			taskid:taskid,
			title:title,
			classlist:classList,
			localsname:newfilename,
			covers:newfilename,
			time:moment(new Date()).format("YYYY-MM-DD HH:mm")
		});
		newwork.save(function(err){
			if(err){console.log(err)}
			Task.updatefinished(taskid,function(err){if(err) console.log(err)})
			User.find({_id:_user._id}).exec(function(err,studata){
				let taskList = studata[0].tasklist;
				User.updateTasklist(_user._id,taskid,function(err){
					if(err) console.log(err)
				})
				res.send({
					status:'success',
					msg:'提交成功'
				})
			})
		})
	}else{
		res.send({
			status:'fail',
			msg:'请先登录'
		})
	}
});

/* POST 加载项目. */
router.get('/downloads', function(req, res, next) {
	const fileId = req.query.fileid;
	if(fileId){
		res.download('public/unreleased/scratch/'+fileId, fileId);
	}else{
		res.send({
			status:'fail'
		})
	}
});
router.get('/downloads/rel', function(req, res, next) {
	const fileId = req.query.fileid;
	if(fileId){
		TchWorks.find({localsname:fileId}).exec(function(err,data){
			if(data.length > 0){
				res.download('public/teacher-pro/scratch/'+data[0].stuid+'/'+fileId, fileId);
			}
		})
	}else{
		res.send({
			status:'fail'
		})
	}
});
//教师模板作品获取
router.get('/tchwork/get', function(req, res, next) {
	let _user = req.session.user;
  if(_user && _user.role == 9){
  	Unrel.find({user: _user._id}).sort({'meta.updateAt':-1}).exec(function(err, worksdata){
	    res.send({
				status:'success',
				msg:worksdata
			})
	  })
	}else{
		res.send({
			status:'fail',
			msg:'请先登录'
		})
	}
});
//学生已完成作品获取
router.get('/stuwork/get', function(req, res, next) {
	let _user = req.session.user;
  if(_user && _user.role == 0){
  	Unrel.find({user: _user._id}).sort({'meta.updateAt':-1}).exec(function(err, worksdata){
	    res.send({
				status:'success',
				msg:worksdata
			})
	  })
	}else{
		res.send({
			status:'fail',
			msg:'请先登录'
		})
	}
});
module.exports = router;
