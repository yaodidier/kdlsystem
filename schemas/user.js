var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
var userSchema = new Schema({
	username:{
		type:String,
		unique: true,
    	require: true 
	},
	nickname:String,
	password:{
	    type: String,
	    require: true
	},
	email:String,
	realname:String,
	headimg:String,
	phoneNum:String,
	qq:String,
	wx:String,
	motto:String,
	token:String,
	time:String,
	remark:{
		type: String,
	 	default:'-'
	},
	classlist:[{
		klassid: {type:ObjectId, ref:'Klass'},
		joinAt: {
			type:Date,
			default: Date.now()
		}
	}],
	tchlist:[{
		teacherid: {type:ObjectId, ref:'User'}
	}],
	taskstatus:{
		type: Number,
		default:0
	},
	tasklist:[{
		taskid: {type:ObjectId, ref:'Task'}
	}],
	noticenum:{
		type:Number,
		default:0
	},
	worksnum:{
	    type: Number,
		default:0
	},
	status:{
	    type: Number,
		default:0
	},
	role:{
	    type: Number,
		default:0
	},
	classNum:{
		type: Number,
		default:10
	},
	stuNum:{
		type: Number,
		default:35
	},
	meta:{
		createAt: {
			type:Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
})
userSchema.pre('save', function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}
	next();
})
userSchema.statics = {
	fetch:function(cb){
		return this
		.find({})
		.exec(cb)
	},
	fetchByName:function(username, cb){
		return this
		.find({username: username}).populate('classlist.klassid','classname')
		.exec(cb)
	},
	fetchById:function(userid, cb){
		return this
		.find({_id: userid})
		.exec(cb)
	},
	updateById: function(updatemsg, cb){
		return this
		.update({'_id':updatemsg._id},{$set:{
			nickname: updatemsg.nickname,
			email: updatemsg.email,
			realname: updatemsg.realname,
			headimg: updatemsg.headimg,
			phoneNum: updatemsg.phoneNum,
			qq: updatemsg.qq,
			wx: updatemsg.wx,
			motto: updatemsg.motto
		}})
		.exec(cb)
	},
	updateNoticenum:function(userid,cb){
		return this
		.update({_id:userid},{$set:{noticenum:0}})
		.exec(cb)
	},
	updateAllnotice:function(cb){
		return this
		.update({status:0},{$inc:{noticenum:1}},{ multi: true } )
		.exec(cb)
	},
	updateOnenotice:function(userid, cb){
		return this
		.update({_id:userid},{$inc:{noticenum:1}})
		.exec(cb)
	},
	fetchByclassid:function(id, cb){
		return this
		.find({'classlist.klassid': id})
		.exec(cb)
	},
	updateremark:function(id,msg, cb){
		return this
		.update({_id: id},{$set:{remark:msg}})
		.exec(cb)
	},
	updatepwd:function(id,pwd, cb){
		return this
		.update({_id: id},{$set:{password:pwd}})
		.exec(cb)
	},
	updateOutclass:function(id,cid, cb){
		return this
		.update({_id: id},{$pull:{classlist:{klassid:cid}}})
		.exec(cb)
	},
	updateInclass:function(id, tid, cid, cb){
		return this
		.update({_id: id},{$push:{tchlist:{teacherid:tid},classlist:{klassid:cid}}})
		.exec(cb)
	},
	fetchBynoclassid:function(cb){
		return this
		.find({role:0, classlist: []})
		.exec(cb)
	},
	updateTasklist:function(id,tid, cb){
		return this
		.update({_id: id},{$push:{tasklist:{taskid:tid}}})
		.exec(cb)
	},
	updateInfo: function(id,updatemsg, cb){
		return this
		.update({_id:id},{$set:{
			nickname: updatemsg.nickname,
			headimg: updatemsg.headimg
		}})
		.exec(cb)
	}
}
module.exports = userSchema