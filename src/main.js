const mysql = require('mysql2');
const express = require('express');
const dotenv = require('dotenv')
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



app.get("/todo", (req, res) => {
    const selectSql = "SELECT * FROM items";
    cnx.query(selectSql, (err, results) => {
        res.json({todos: results})



    });
});



app.post('/hello', (request, response) => {
    const { description } = request.body;
    const insertSQL = 'INSERT INTO items (description) VALUES (?)';
    cnx.query(insertSQL, [description])
           
     response.redirect("/");
           
});

app.post('/delete', (request, response) => {
    const { id } = request.body;
    const deleteSql = 'DELETE FROM items WHERE id = ?';
    cnx.query(deleteSql, [id])
           
     response.redirect("/");
           
});

app.post('/update', (request, response) => {
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


    })
           
     response.redirect("/");
           
});




app.listen(port, () => {
    console.log(`Server läuft auf Port ${port}`);
})    