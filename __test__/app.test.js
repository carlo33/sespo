const request = require('supertest');
const app = require('../api/index');

describe('Probando nuestro servidor SESPO',()=>{
    test('Debe  de responder al metodo GET',done=>{
        request(app).get('/test').then((response)=>{
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});