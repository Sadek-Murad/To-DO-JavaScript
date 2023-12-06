const mysql = require('mysql2');
const express = require('express');
const app = express()
const port = 3000;
require('dotenv').config();


function get_database_connection() {
const cnx = mysql.createConnection({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE
});
   return cnx

}

const cnx = get_database_connection ();

app.use(express.json());



app.get("/", (req, res) => {
    const selectSql = "SELECT * FROM items;"
    cnx.query(selectSql, (err, results) => { 
        console.log(err);
        res.json({todos: results})
    });
});


app.post('/', (request, response) => {
    const { description } = request.body;
    const insertSQL = 'INSERT INTO items (description) VALUES (?);';
    cnx.query(insertSQL, [description], (err, results) => {
        response.status(200).send();
    }) 
           
    
           
});

app.delete('/', (request, response) => {
    const { id } = request.body;
    const deleteSql = 'DELETE FROM items WHERE id = ?;';
    cnx.query(deleteSql, [id], (err, results) => {
        //response.status(400);
    })
           
     response.status(200).send();
           
});

app.put('/', (request, response) => {
    console.log(request.body);
    const { id } = request.body;
    

    
  const updateSql = `
    UPDATE items
    SET status = CASE
      WHEN status = 'open' THEN 'in progress'
      WHEN status = 'in progress' THEN 'finished'
      ELSE status
    END
    WHERE id = ?;
  `;
    cnx.query(updateSql, [id], (err, results) => {
        response.status(200).send();

    })
           
    
           
});




app.listen(port, () => {
    console.log(`Server läuft auf Port ${port}`);
})    