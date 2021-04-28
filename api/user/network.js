const express= require ('express');
const controller = require('./controller');
const response = require('../../network/response');
const secure = require('./secure');
const router=express.Router();

router.post('/',registerUser);
router.put('/',secure('update'),updateUser);
router.get('/codeVerification',getCode);
router.post('/newPassword',setNewPassword); 
function registerUser(req,res){
    controller.upsert(req.body)
        .then (token=>{
            if(!token){
                response.success(req,res,'user already exists',401)
            }else{
                response.success(req,res,token,200);
            }
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
function getCode(req,res){
    controller.getCode(req.body)
        .then (result=>{
            if(result){
                response.success(req,res,'code sended',200);
            }else{
                response.success(req,res,'user does not exits',401);
            }
        })
        .catch((err)=>{
            console.log(err);
            response.error(req,res,'Internal server error',500)
        })
}
function setNewPassword(req,res){
    controller.setNewPassword(req.body)
        .then (result=>{
            if(result){
                response.success(req,res,'password update',200);
            }else{
                response.success(req,res,'code wrong',401);
            }
        })
        .catch((err)=>{
            console.log(err);
            response.error(req,res,'Internal server error',500)
        })
}
module.exports = router;