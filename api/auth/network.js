const express= require ('express');
const controller = require('./controller');
const response = require('../../network/response');

const router=express.Router();

router.post('/',loginSespo);

function loginSespo(req,res,next){
    controller.login(req.body.username,req.body.password)
        .then (token=>{
            console.log(token);
            response.success(req,res,token,200);
        })
        .catch(next)
}

module.exports = router;