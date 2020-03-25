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
        pool.query('INSERT INTO users (username, passwordhash) VALUES (($1), ($2));', [user.username, hash], (error, results) => {
            if (error) {
                throw error;
            }
        res.json({message : "Uusi käyttäjä luotu!"});
            });
        });
};

function checkUser (req, res) {
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
                    res.json({message : "Sisäänkirjautuminen onnistui!"})
                } else {
                    res.json({message : "Sisäänkirjautuminen epäonnistui: Väärä käyttäjätunnus tai salasana"}).status(403);
                }
            });
        }
        else {
            res.json({message : "Tämän nimistä käyttäjätunnusta ei ole olemassa!"}).status(403);
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
    checkUser
  }