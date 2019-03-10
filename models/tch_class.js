var mongoose = require('mongoose');
var klassSchema = require('../schemas/tch_class');
var Klass = mongoose.model('Klass', klassSchema)
module.exports = Klass
