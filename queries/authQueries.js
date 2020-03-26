const bcrypt = require('bcrypt');
const saltRounds = 8;

const Pool = require('pg').Pool
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
    connectionString: connectionString
});

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
    pool.query('SELECT passwordhash FROM users WHERE username = ($1);', [req.body.username], (error, results) => {
        if (error) {
            throw error;
        }
        if (results.rowCount == 1) {
            bcrypt.compare(req.body.password, results.rows[0].passwordhash, (err, result) => {
                if (err) {
                    throw err;
                }
                if (result) {
                    res.json({message: "Sisäänkirjautuminen onnistui!", auth: true });
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
            res.json({message :"Käyttäjätunnus on varattu!"});
        }
    });
};

  module.exports = {
    signUp,
    checkLogin
  }