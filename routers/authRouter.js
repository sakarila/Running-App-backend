const express = require('express');
const router = express.Router();
const {signUp, checkLogin} = require('../queries/authQueries')

function validUser(user) {
    const validUser = typeof user.username == 'string' && user.username.trim() != '';
    const validPassword = typeof user.password == 'string' && user.password.trim() != '';
    return validUser && validPassword;
}

router.post('/signup', (req, res) => {
    if (validUser(req.body)) {
        signUp(req, res); 
    } else {
        res.send("Tarkista täyttämäsi kentät!");
    }  
});

router.post('/signin', (req, res) => {
    checkLogin(req, res);
});

router.get('/', (req, res) => {
    res.send("Ainakin root toimii");
});

module.exports = router;