const express = require('express');
require('./db/mongoose');
const log = console.log;

const app = express();

app.use(express.json());
app.use(require('./routers/users'));
app.use(require('./routers/tasks'));

const PORT = process.env.PORT;
app.listen(PORT, () => log(`Listening on port ${PORT}`));