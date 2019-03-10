var mongoose = require('mongoose');
var classworkSchema = require('../schemas/tch_works');
var ClassWork = mongoose.model('ClassWork', classworkSchema)
module.exports = ClassWork
