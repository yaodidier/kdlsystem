const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
var classworkSchema = new Schema({
	stuid: {type:ObjectId, ref:'User'},
	taskid: {type:ObjectId, ref:'Task'},
	classlist:[{
		classid:{type:ObjectId, ref:'Klass'}
	}],
	title:String,
	localsname:String,
	time:String,
	covers:String,
	ismarking:{
		type:Boolean,
		default:false
	},
	markpoint:{
		type:Number,
		default:90
	},
	showstatus:{
		type:Number,
		default:0
	},
	py:String,
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
classworkSchema.pre('save', function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}
	next();
})
classworkSchema.statics = {
	findBystuid:function(stuid, cb){
		return this
		.find({stuid: stuid})
		.exec(cb)
	},
	findByhaswork:function(sid, tid, cb){
		return this
		.find({stuid:sid,taskid:tid})
		.exec(cb)
	},
	updateById:function(userid,oldname,localsname,covers, cb){
		return this
		.update({stuid: userid,localsname:oldname},{$set:{
			localsname:localsname,
			covers:covers,
			'meta.updateAt':Date.now()
		}})
		.exec(cb)
	},
	updatePfById:function(id,status,pynum,pycont, cb){
		return this
		.update({_id: id},{$set:{
			ismarking:true,
			markpoint:pynum,
			showstatus:status,
			py:pycont
		}})
		.exec(cb)
	}
	
}
module.exports = classworkSchema;
