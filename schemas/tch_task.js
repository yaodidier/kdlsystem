var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
var taskSchema = new Schema({
	types:String,
	title:String,
	content:String,
	video:String,
	creater:{type:ObjectId, ref:'User'},
	classlist:[{
		classid: {type:ObjectId, ref:'Klass'}
	}],
	worksNum:{
		type:Number,
		default:1
	},
	templet:[{
		workid:{type:ObjectId, ref:'Unrel'}
	}],
	endtime:String,
	time:String,
	isrelesed:{
		type:Number,
		default:0
	},
	isfinished:{
		type:Number,
		default:0
	},
	status:{
		type:Number,
		default:0
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
taskSchema.pre('save', function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}
	next();
})
taskSchema.statics = {
	findBytchid:function(tchid,cb){
		return this
		.find({creater:tchid}).sort({'meta.createAt':-1})
		.exec(cb)
	},
	findByclassid:function(classid,cb){
		return this
		.find({'classlist.classid':classid}).sort({'meta.createAt':-1})
		.exec(cb)
	},
	updatefinished:function(id,cb){
		console.log(id)
		return this
		.update({_id:id},{$inc:{isfinished:1}})
		.exec(cb)
	},
	updateDownfinished:function(id,cb){
		return this
		.update({_id:id},{$inc:{isfinished:-1}})
		.exec(cb)
	},
}
module.exports = taskSchema
