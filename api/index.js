const express = require('express');

const swaggerUi = require('swagger-ui-express');

const pdf = require('./pdf/network');
const auth = require('./auth/network');
const user = require('./user/network');
const email = require('./email/network');
const  test = require ('./test');
const config = require('../config');
const errors = require('../network/errors');

const app = express();
app.use(express.json());
const swaggerDoc = require('./swagger.json');

//ROUTER
app.use('/test',test)
app.use('/api/sespo',pdf);
app.use('/api/sespo/login',auth);
app.use('/api/sespo/user',user);
app.use('/api/sespo/email',email);
app.use('/api-docs',swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use(errors);

app.listen(config.api.port, ()=>{
  console.log('API escuchando en el puerto:',config.api.port);
})