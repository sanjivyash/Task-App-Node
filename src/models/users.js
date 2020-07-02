const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./tasks');

// create the schema
const UserSchema = new mongoose.Schema({
	username: { 
		type: String,
		unique: true,
		trim: true,
		required: true
	},
	email: {
		type: String,
		unique: true,
		trim: true,
		required: true,
		validate: {
			validator(value) {
				if(!validator.isEmail(value)){
					throw new Error('Invalid email address');
				}
			}
		}
	},
	password: {
		type: String,
		trim: true,
		minlength: 7,
		validate: {
			validator(value){
				if(value.toLowerCase().includes('password')){
					throw new Error('Set a stronger password');
				}
			}
		}
	},
	age: {
		type: Number,
		default: 0,
		validate: {
			validator(value) {
				if(value < 0) {
					throw new Error('Age has to be a non-negative number');
				}
			}
		}
	},
	tokens: [{
		token: {
			type: String,
			required: true
		}
	}],
	avatar: {
		type: Buffer
	}
}, {
	timestamps: true
});

// static function
UserSchema.statics.findByCredentials = async function(username, password) {
	const user = await User.findOne({ username });

	if(user){
		const isValid = await bcrypt.compare(password, user.password);
		if(isValid){
			return user;
		} else {
			console.log('Password')
			throw new Error('Invalid Password');
		}
	} else {
		console.log('Username')
		throw new Error('Invalid username');
	}
} 

// instance methods
UserSchema.methods.generateAuthToken = async function() {
	const token = await jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET);
	this.tokens.push({ token });
	await this.save();
	return token;
} 
// instance methods
UserSchema.methods.toJSON = function() {
	const user = this.toObject();
	delete user.tokens;
	delete user.password;
	delete user.avatar;
	return user;
}

// password hashing (middleware?)
UserSchema.pre('save', async function(next) {
	if(this.isModified('password')){
		this.password = await bcrypt.hash(this.password, 8);
	}
	next();
});

// delete tasks when user deleted
UserSchema.pre('remove', async function(next) {
	await Tasks.deleteMany({ owner: this._id });
	next();
});

// actual model
const User = mongoose.model('User', UserSchema);
module.exports = User;