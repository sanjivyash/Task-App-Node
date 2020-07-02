const mongoose = require('mongoose');
const User = require('./users');

const TaskSchema = mongoose.Schema({
	description: {
		type: String,
		required: true,
		trim: true
	},
	completed: {
		type: Boolean,
		default: false
	},
	owner: {
		type: mongoose.Schema.Types.ObjectID,
		required: true
	}
}, {
	timestamps: true
});

// TaskSchema.methods.toJSON = function() {
// 	const task = this.toObject();
	
// 	return task;
// }

const Task = mongoose.model('Task', TaskSchema);
module.exports = Task;
