const mongoose = require('mongoose');
const express = require('express');
const User = require('../models/users');
const Task = require('../models/tasks');

const auth = require('../middleware/auth');
const log = console.log;

const router = express.Router();

// Create Task
router.post('/tasks', auth, async (req, res) => {
	try {
		const task = new Task({
			...req.body,
			owner: req.user._id
		});
		await task.save();
		res.send({ user: req.user, task });
	} catch(e) {
		res.status(400).send();
	}
});

// Get All Tasks
router.get('/tasks', auth, async (req, res) => {
	try {
		let tasks = '';
		if(req.query.completed){
			const completed = Boolean(req.query.completed);
			tasks = await Task.find({ owner: req.user._id, completed });
		} else {
			tasks = await Task.find({ owner: req.user._id });	
		}
		return res.send({ user: req.user, tasks });
	} catch(e) {
		res.status(400).send();
	}
});

// Read Task
router.get('/tasks/:id', auth, async (req, res) => {
	try{
		const task = await Task.findByID({ _id: id });
		if(task.owner === req.user._id) {
			res.send({ user: req.user, task });
		} else {
			throw new Error();
		}
	} catch(e) {
		res.status(400).send();
	}
});

// Update Task
router.patch('/tasks/:id', auth, async (req, res) => {
	try {
		const task = await Task.findByID({ _id: id });

		if(task.owner === req.user._id) {
			const upates = Object.keys(req.body);
			const fields = ['description', 'completed'];
			const isValid = updates.every(update => fields.includes(update));

			if(isValid) {
				updates.forEach(update => task[update] = req.body[update]);
				await task.save();
				res.send({ user: req.user, task });
			} else {
				throw new Error();
			}
		} else {
			throw new Error();
		}
	} catch(e) {
		res.status(400).send();
	}
});

// Delete Task
router.delete('/tasks/:id', auth, async (req, res) => {
	try {
		const task = await Task.findByID({ _id: id });

		if(task.owner === req.user._id) {
			await task.remove();
			res.send({ user: req.user, task });
		} else {
			throw new Error();
		}
	} catch(e) {
		res.status(400).send();
	}
})

module.exports = router;