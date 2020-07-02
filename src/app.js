const express = require('express');
require('./db/mongoose');

const app = express();

app.use(express.json());
app.use(require('./routers/users'));
app.use(require('./routers/tasks'));

module.exports = app;