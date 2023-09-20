const pg = require("pg")
const client = new pg.Client('postgres://localhost/morgan')
const express = require("express")
const app = express()

const start = async () => {
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
        console.log(`listening on${PORT}`);
    });
};

start()