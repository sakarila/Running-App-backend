const { pool } = require('./pool')

function createRun(req, res) {
    pool.query('INSERT INTO runs (date, userid, time, altitude, distance, calories, coordinates) VALUES (($1), ($2), ($3), ($4), ($5), ($6), ($7));',
    [req.body.date, req.body.userid, req.body.time, req.body.altitude, req.body.distance, req.body.calories, JSON.stringify(req.body.coordinates)], (error, results) => {
        if (error) {
            throw error;
        }
        res.json({message : "Uusi lenkki tallennettu!", status: true});
    });
};

function getRuns(req, res) {
    pool.query('SELECT id, date, time, altitude, distance, calories, coordinates FROM runs WHERE userid=($1);', [req.body.userid], (error, results) => {
        if (error) {
            throw error;
        }
        res.json(results.rows);
    });
}

module.exports = {
    createRun,
    getRuns
  }