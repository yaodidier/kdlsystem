var mongoose = require('mongoose');
var taskSchema = require('../schemas/tch_task');
var Task = mongoose.model('Task', taskSchema)
module.exports = Task
