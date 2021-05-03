const express= require ('express');
const response = require('../network/response');
const router=express.Router();

router.get('/',test);

function test(req,res){
    response.success(req,res,'Servidor esta corriendo',401)
}
module.exports = router;