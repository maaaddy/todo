const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: {type:String, required:true},
    desc: {type:String, required:true},
}, {timestamps:true});

const TaskModel = mongoose.model('Task', TaskSchema);
module.exports = TaskModel;