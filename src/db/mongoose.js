const mongoose = require('mongoose');
const log = console.log;

mongoose.connect(process.env.DATABASE_URL, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true
})	
	.then(() => log('Database connection established!'))
	.catch(() => log('Connection dumped'));