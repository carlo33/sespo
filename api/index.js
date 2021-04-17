const express = require('express');
const pdf = require('./managePdf/network');
const config = require('../config');

const app = express();
app.use(express.json());

//ROUTER
app.use('/api/sespo',pdf)

app.listen(config.api.port, ()=>{
  console.log('API escuchando en el puerto:',config.api.port);
})