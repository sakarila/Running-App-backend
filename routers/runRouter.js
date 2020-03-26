const express = require('express');
const router = express.Router();
const {createRun, getRuns} = require('../queries/runQueries')

router.post('/all', (req, res) => {
    getRuns(req, res);
});

router.post('/', (req, res) => {
    createRun(req, res);
});

router.get('/', (req, res) => {
    res.send("GET-metodin root. Ihan testinä");
});

module.exports = router;