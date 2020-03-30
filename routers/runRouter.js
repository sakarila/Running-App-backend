const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const {createRun, getRuns} = require('../queries/runQueries')

router.post('/all', (req, res) => {
    jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
        if(err) {
            res.sendStatus(403);
        } else {
            getRuns(req, res);
        }
    })
});

router.post('/', verifyToken, (req, res) => {
    jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
        if(err) {
            res.sendStatus(403);
        } else {
            createRun(req, res);
        }
    })
});

router.get('/', (req, res) => {
    res.send("GET-metodin root. Ihan testinä");
});

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (typeof authHeader !== 'undefined') {
        const bearer = authHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
} 

module.exports = router;