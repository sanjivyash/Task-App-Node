const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/users'); 

const auth = async (req, res, next) => {
	try{
		// regex time
		const token = req.header('Authorization').replace(/Bearer /g, '');
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const user = await User.findOne({ _id: decoded._id });
		// extract all tokens
		const tokens = user.tokens.map(obj => obj.token);
		if(tokens.includes(token)){
			req.user = user;
			req.token = token;
			next();
		} else {
			throw new Error();
		}
	} catch(e) {
		res.status(401).send({ error: 'Please authenticate' });
	}
};

module.exports = auth;