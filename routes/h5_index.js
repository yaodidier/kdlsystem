const express = require('express');
const Works = require('../models/works');
const router = express.Router();
const moment = require('moment');
moment.locale('zh-CN');

let pagetitle = ' - 编程社区 Scratch 3.0 少儿编程社区';

router.get('/works/content/:id', function(req, res, next) {
  let worksid = req.params.id;
  let _user = req.session.user;
  if(_user){
    res.locals.user = _user
  }
  Works.find({_id:worksid}).exec(function(err, worksdata){
    if(worksdata && worksdata.length > 0){
      Works.updateLooks(worksid, function(err){
        if(err) console.log(err)
      })
      res.render('h5/works_content', {
        title: worksdata[0].title + pagetitle,
        works: worksdata[0],
        createtime: moment(worksdata[0].meta.createAt).format('L'),
        updatetime: moment(worksdata[0].meta.updateAt).format('L'),
      });
    }else{
      res.redirect('error')
    }
  }) 
});


module.exports = router;
