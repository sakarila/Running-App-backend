const bcrypt = require('bcrypt');
const saltRounds = 8;

const Pool = require('pg').Pool
const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.DB_PORT,
});

function createUser(user, res) {
    bcrypt.hash(user.password, saltRounds, function(err, hash) {
        if (err) {
            throw err;
        }
        pool.query('INSERT INTO users (username, passwordhash) VALUES (($1), ($2));', [user.username, hash], (error, results) => {
            if (error) {
                throw error;
            }
        res.send("Uusi käyttäjä luotu!")
            });
        });
};

function checkUser (req, res) {
    pool.query('SELECT passwordhash FROM users WHERE username = ($1);', [req.body.username], (error, results) => {
        if (error) {
            throw error;
        }
        bcrypt.compare(req.body.password, results.rows[0].passwordhash, (err, result) => {
            if (err) {
                throw err;
            }
            if (result) {
                res.send("Käyttäjätunnus ja salasana oikein!");
            } else {
                res.send("Väärä käyttäjätunnus tai salasana!");
            }
        });
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
            res.send("Käyttäjätunnus on varattu!");
        }
    });
};

  module.exports = {
    signUp,
    checkUser
  }