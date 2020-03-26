require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const auth = require('./routers/authRouter');
const run = require('./routers/runRouter');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
});

app.use('/auth', auth);
app.use('/run', run);