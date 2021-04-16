const express = require ('express');
const controller = require('./controller');
const response = require('../network/response');
const router = express.Router();

router.get('/',readDataSqlite);


function readDataSqlite(req,res){
    controller.readData()
        .then((result)=>{
            response.success(req,res,result,200);
        })
        .catch((err)=>{
            response.error(req,res,err,500);
        })
        
}

module.exports = router;