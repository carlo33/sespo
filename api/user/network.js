const express= require ('express');
const controller = require('./controller');
const response = require('../../network/response');
const secure = require('./secure');
const router=express.Router();

router.post('/',registerUser);
router.put('/',secure('update'),updateUser);

function registerUser(req,res){
    controller.upsert(req.body)
        .then (user=>{
            response.success(req,res,user,200);
        })
        .catch((err)=>{
            console.log(err);
            response.error(req,res,'Internal server error',500)
        })
}
function updateUser(req,res){
    controller.update(req.body)
        .then (user=>{
            response.success(req,res,user,200);
        })
        .catch((err)=>{
            console.log(err);
            response.error(req,res,'Internal server error',500)
        })
}

module.exports = router;