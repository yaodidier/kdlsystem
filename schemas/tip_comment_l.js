let mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
// comid 是回复的id
let lcommentipSchema = new Schema({
	fromid: {type:ObjectId, ref:'User'},
	toid: {type:ObjectId, ref:'Lcomment'},
	comid: String,
	content:String,
	diff:String,
	status:{
		type:Number,
		default:0
	},
	createAt:String,
	meta:{
		createAt: {
			type:Date,
			default: Date.now()
		}
	}
})
lcommentipSchema.statics = {
	removeById:function(id, cb){
		return this
		.remove({_id: id})
		.exec(cb)
	}
}
module.exports = lcommentipSchema