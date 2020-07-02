const app = require('./app');
const log = console.log;

const PORT = process.env.PORT;
app.listen(PORT, () => log(`Listening on port ${PORT}`));