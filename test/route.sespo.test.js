const request = require('supertest');
const app = require('../api/index');

describe('POST /api/sespo/user',()=>{
    it('should respond with status 200',done=>{
        const user={
                username:"81818181",
                name:"Luis Quispe",
                email:"cyaco33@gmail.com",
                licence_key:" ",
                licence_type:"Free",
                entity:"Independiente",
                password:"12345"
        };
        request(app)
            .post('/api/sespo/user')
            .send(user)
            .set('Accept','application/json')
            .expect('Content-Type',/json/)
            .expect(201)
            .end((err)=>{
                if(err) return done(err);
                done();
            })
    })
})