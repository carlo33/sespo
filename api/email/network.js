const express =require('express');
const response = require('../../network/response');
const controller = require('./controller');

const router = express.Router();

router.post('/',sendEmail);

function sendEmail(req,res){
    controller.sendEmail(req.body)
        .then(result=>{
            console.log('email sended');
            response.success(req,res,result,200);
        })
        .catch((err)=>{
            console.log(err);
            response.error(req,res,'Internal server error',500);
        })
}
module.exports= router;