const express= require ('express');
const controller = require('./controller');
const response = require('../../network/response');

const router=express.Router();

router.post('/',loginSespo);

function loginSespo(req,res){
    controller.login(req.body.username,req.body.password)
        .then (token=>{
            console.log(token);
            response.success(req,res,token,200);
        })
        .catch((err)=>{
            console.log(err);
            response.error(req,res,'User or password incorect',401);
        })
}

module.exports = router;