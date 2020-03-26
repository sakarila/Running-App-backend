const express = require('express');
const router = express.Router();
// const {signUp, checkLogin} = require('../queries/runQueries')

router.post('/all', (req, res) => {
    res.send("Tää antais kaikki käyttäjän lenkit");
});

router.post('/', (req, res) => {
    res.send("Tänne sit syötettäis niitä yksittäisen lenkin tietoja");
});

module.exports = router;