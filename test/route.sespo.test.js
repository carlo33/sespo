const request = require('supertest');
const app = require('../api/index');

describe('POST /api/sespo/user',()=>{
    it('should respond with status 200',done=>{
        const user={
                username:"82828282",
                name:"Carlos Lopez",
                email:"cyaco82@gmail.com",
                licenceKey:" ",
                licenceType:"Free",
                entity:"Independiente",
                password:"12345"
        };
        request(app)
            .post('/api/sespo/user')
            .send(user)
            .set('Accept','application/json')
            .expect('Content-Type',/json/)
            .expect(200)
            .end((err)=>{
                if(err) return done(err);
                done();
            })
    })
})