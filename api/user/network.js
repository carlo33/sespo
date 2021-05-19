const express= require ('express');
const controller = require('./controller');
const response = require('../../network/response');
const secure = require('./secure');
const router=express.Router();

router.post('/',registerUser);
router.put('/',secure('update'),updateUser);
router.post('/newPassword',setNewPassword); 
router.get('/generateCode',getCode);
router.delete('/',deleteUser);
function registerUser(req,res,next){
    controller.insert(req.body)
        .then (token=>{
            if(!token){
                response.success(req,res,'user already exists',401)
            }else{
                response.success(req,res,token,201);
            }
        })
        .catch(next)
}
function updateUser(req,res,next){
    controller.update(req.body)
        .then (user=>{
            response.success(req,res,user,200);
        })
        .catch(next)
}
function getCode(req,res,next){
    controller.getCode(req.body)
        .then (result=>{
            if(result){
                response.success(req,res,'code sended',200);
            }else{
                response.success(req,res,'user does not exits',401);
            }
        })
        .catch(next)
}
function setNewPassword(req,res,next){
    controller.setNewPassword(req.body)
        .then (result=>{
            if(result){
                response.success(req,res,'password update',200);
            }else{
                response.success(req,res,'code wrong',401);
            }
        })
        .catch(next)
}
function deleteUser(req,res,next){
    controller.deleteUser(req.body)
        .then (result=>{
            if(result){
                response.success(req,res,'user deleted',200);
            }else{
                response.success(req,res,'user not exits',401);
            }
        })
        .catch(next)
}
module.exports = router;