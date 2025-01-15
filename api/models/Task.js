const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: {type:String, required:true},
    desc: {type:String},
    dueDate: {type:Date, default: null},
}, {timestamps:true});

const TaskModel = mongoose.model('Task', TaskSchema);
module.exports = TaskModel;