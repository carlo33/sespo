const express = require('express');
const supertest = require('supertest');

function serverTest(route){
    const app = express();
    route(app);
    return supertest(app);
}

module.exports = serverTest;