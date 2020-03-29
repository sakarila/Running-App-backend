const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 8;
const { pool } = require('./pool')

function createUser(user, res) {
    bcrypt.hash(user.password, saltRounds, function(err, hash) {
        if (err) {
            throw err;
        }
        pool.query('INSERT INTO users (username, passwordhash, weight) VALUES (($1), ($2), ($3));', [user.username, hash, user.weight], (error, results) => {
            if (error) {
                throw error;
            }
        res.json({message : "Uusi käyttäjä luotu!", status: true});
            });
        });
};

function checkLogin (req, res) {
    pool.query('SELECT id, passwordhash FROM users WHERE username = ($1);', [req.body.username], (error, results) => {
        if (error) {
            throw error;
        }
        if (results.rowCount == 1) {
            bcrypt.compare(req.body.password, results.rows[0].passwordhash, (err, result) => {
                if (err) {
                    throw err;
                }
                if (result) {
                    jwt.sign({id: results.rows[0].id}, process.env.JWT_KEY, (err, token) => {
                        res.json({message: "Sisäänkirjautuminen onnistui!", auth: true, id: results.rows[0].id, token: token});
                    })
                } else {
                    res.json({message : "Sisäänkirjautuminen epäonnistui: Väärä käyttäjätunnus tai salasana", auth: false});
                }
            });
        }
        else {
            res.json({message : "Tämän nimistä käyttäjätunnusta ei ole olemassa!", auth: false});
        }
    });
};

const signUp = (req, res) => {
    // Checking if user exists in database already.
    pool.query('SELECT exists (SELECT 1 FROM users WHERE username = ($1));', [req.body.username], (error, results) => {
        if (error) {
            throw error;
        }
        if (!results.rows[0].exists) {
            createUser(req.body, res);
        }
        else {
            res.json({message :"Käyttäjätunnus on varattu!", status: false});
        }
    });
};

  module.exports = {
    signUp,
    checkLogin
  }