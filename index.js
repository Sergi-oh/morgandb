const pg = require("pg")
const client = new pg.Client('postgres://localhost/morgan')
const express = require("express")
const app = express()
app.use(express.json())

app.get('/api/shows', async (req,res, next) => {
    try {
        const SQL = `
            SELECT *
            FROM shows;
        `
        const response = await client.query(SQL)
        res.send(response.rows)
    } catch (error) {
        next(error)
    };
});

app.get('/api/shows:id', async(req,res,next) => {
    try {
        const SQL =`
            SELECT *
            FROM shows
            WHERE id=$1;
        `
        const response = await client.query(SQL, [req.params.id])
        if(response.rows.length === 0){
            throw new Error("This show does not exist!")
        }
        res.send(response.rows)
    } catch (error) {
        next(error)
    };
});

app.post('/api/shows', async (req,res,next) => {
    try {
        const SQL = `
            UPDATE shows
            SET name = $1, genre = $2
            WHERE id = $3
            RETURNING *;
        `
        const response = await client.query(SQL, [req.body.name,req.body.genre, req.params.id])
        res.send(response.rows)
    } catch (error){
        next(error)
    };
});

app.delete('/api/shows:id', async (req,res,next) => {
    const SQL = `
        DELETE FROM shows
        WHERE id =$1
        RETURNING *;
    `

    const response = await client.query(SQL, [req.params.id]);
    res.sendStatus(204)
});

app.use('*', (req,res,next) => {
    res.status(404).send("404 page not found")
});

app.use((err,req,res,next) => {
    res.status(500).send(err.message)
});

const start = async () => {
    await client.connect()
    console.log("connect to db")
    const SQL = `
        DROP TABLE IF EXISTS shows;
        CREATE TABLE shows(
            id SERIAL PRIMARY KEY,
            name VARCHAR(100),
            genre VARCHAR(100),
        );
        INSERT INTO shows (name, genre) VALUES ('bleach', 'anime');
        INSERT INTO shows (name, genre) VALUES ('deathnote', 'anime');
        INSERT INTO shows (name, genre) VALUES ('naruto', 'anime');
        INSERT INTO shows (name, genre) VALUES ('gintama', 'anime');
    `
    await client.query(SQL)
   
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
        console.log(`listening on${PORT}`);
    });
};

start()