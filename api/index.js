const express = require('express');
const pdf = require('./gestionPdf/network');
const config = require('../config');

const app = express();
app.use(express.json());

//ROUTER
app.use('/api/pdf',pdf)

app.listen(config.api.port, ()=>{
  console.log('API escuchando en el puerto:',config.api.port);
})