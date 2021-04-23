const express = require('express');
const pdf = require('./managePdf/network');
const auth = require('./auth/network');
const user = require('./user/network');
const config = require('../config');

const app = express();
app.use(express.json());

//ROUTER
app.use('/api/sespo',pdf);
app.use('/api/sespo/login',auth);
app.use('/api/sespo/user',user);

app.listen(config.api.port, ()=>{
  console.log('API escuchando en el puerto:',config.api.port);
})