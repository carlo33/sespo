const express = require('express');
const manageSqlite = require('./network'); 

const app = express();
app.use(express.json());

app.use('/api/sqlite',manageSqlite)

app.listen(3001,()=>{
    console.log('API escuchando en el puerto 3001')
})