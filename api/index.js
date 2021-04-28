const express = require('express');
const pdf = require('./managePdf/network');
const auth = require('./auth/network');
const user = require('./user/network');
const email = require('./email/network');
const config = require('../config');
const errors = require('../network/errors');
const app = express();
app.use(express.json());

//ROUTER
app.use('/api/sespo',pdf);
app.use('/api/sespo/login',auth);
app.use('/api/sespo/user',user);
app.use('/api/sespo/email',email);
app.use(errors);

app.listen(config.api.port, ()=>{
  console.log('API escuchando en el puerto:',config.api.port);
})