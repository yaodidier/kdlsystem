var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
var klassSchema = new Schema({
	classname:String,
	tchlist:[{
		teacherid:{type:ObjectId, ref:'User'}
	}],
	total:{
		type:Number,
		default:0
	},
	invitecode:String,
	time:String,
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
klassSchema.pre('save', function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}
	next();
})
klassSchema.statics = {
	findBytchid:function(tchid,cb){
		return this
		.find({'tchlist.teacherid':tchid}).sort({'meta.createAt':-1})
		.exec(cb)
	},
	fetchBytchid:function(id,tchid,cb){
		return this
		.find({_id:id,'tchlist.teacherid':tchid})
		.exec(cb)
	},
	fetchByName:function(id,classname,cb){
		return this
		.find({'tchlist.teacherid':id,classname: classname})
		.exec(cb)
	},
	updateNameById:function(id,classname,cb){
		return this
		.update({_id:id},{$set:{classname:classname}})
		.exec(cb)
	},
	updateTotal:function(id,total,cb){
		return this
		.update({_id:id},{$inc:{total:total}})
		.exec(cb)
	},
	updateDownTotal:function(id,cb){
		return this
		.update({_id:id},{$inc:{total:-1}})
		.exec(cb)
	},
	removeById:function(id,cb){
		return this
		.remove({_id:id})
		.exec(cb)
	}
}
module.exports = klassSchema