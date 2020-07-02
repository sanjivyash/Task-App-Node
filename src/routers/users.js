const mongoose = require('mongoose');
const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

const User = require('../models/users');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const log = console.log;

const router = express.Router();

// Create a user
router.post('/users', async (req, res) => {
	try {
		const user = new User(req.body);
		await user.save();
		const token = await user.generateAuthToken();
		return res.status(201).send({ user, token });
	} catch(e) {
		res.status(400).send(e);
	}
});

// Login user
router.post('/users/login', async(req, res) => {
	try{
		const user = await User.findByCredentials(req.body.username, req.body.password);
		const token = await user.generateAuthToken();
		return res.send({ user, token });
	} catch(e) {
		res.status(400).send(e);
	}
});

// List all Users
router.get('/users', auth, async (req, res) => {
	users = await User.find({}).sort('-username');
	res.send(users);
});

// Read a user by ID
router.get('/users/me', auth, async (req, res) => {
	try {
		const user = req.user;
		res.send(user);
	} catch(e) {
		res.status(400).send();
	}
});

// Update a user
router.patch('/users/me', auth, async (req, res) => {
	try {
		const user = req.user;
		const updates = Object.keys(req.body);
		const fields = ['username', 'age', 'email', 'password'];
		const isValid = updates.every(update => fields.includes(update));

		if(isValid){
			updates.forEach(update => user[update] = req.body[update]);
			await user.save();
			res.send(user);
		} else {
			throw new Error();
		}
		
	} catch(e) {
		res.status(400).send();
	}
});

// Delete a user
router.delete('/users/me', auth, async (req, res) => {
	try {
		const user = req.user;
		await user.remove();
		res.send(user);
	} catch(e) {
		res.status(500).send();
	}
}); 

// Logout a user
router.post('/users/logout', auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter(token => token.token !== req.token);
		await req.user.save();
		res.send({ user: req.user, token: req.token });
	} catch(e) {
		res.status(400).send();
	}
});

// Logout a user from all devices
router.post('/users/logout/all', auth, async (req, res) => {
	try {
		req.user.tokens = []
		await req.user.save();
		res.send({ user: req.user, token: req.token });
	} catch(e) {
		res.status(400).send();
	}
});

// Create user avatars
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
	try {
		const buffer = await sharp(req.file.buffer).resize({ height: 500, width: 500 }).png().toBuffer();
		req.user.avatar = buffer;
		await req.user.save();
		res.send();
	} catch(e) {
		res.status(500).send();
	}
}, (error, req, res, next) => {
	res.status(400).send({ error: error.message });
});

// Update user avatars
router.patch('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
	try {
		const buffer = await sharp(req.file.buffer).resize({ height: 500, width: 500 }).png().toBuffer();
		req.user.avatar = buffer;
		await req.user.save();
		res.send();
	} catch(e) {
		res.status(500).send(e);
	}
}, (error, req, res, next) => {
	res.status(400).send({ error: error.message });
});

// Delete user avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
	try {
		req.user.avatar = undefined;
		await req.user.save();
		res.send();
	} catch(e) {
		res.status(500).send();
	}
});

// Read any avatar
router.get('/users/:id/avatar', async (req, res) => {
	try {	
		const user = await User.findById(req.params.id);
		if(user && user.avatar) {
			const buffer = user.avatar;
			res.set('Content-Type', 'image/png');
			res.send(buffer);
		} else {
			throw new Error();
		}
	} catch(e) {
		res.status(404).send();
	}
});

module.exports = router;