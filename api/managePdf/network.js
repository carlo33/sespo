const express = require ('express');
const managePdf = require('./managePdf');
const response = require('../../network/response');
const mangeSqlite = require('../manageSqlite/controller')

const router =express.Router();
//Router
router.get('/pdf',gPdf);
router.delete('/pdf',dPdf);
router.get('/sqlite',readDataSqlite);

function gPdf (req,res){
    managePdf.generatePdf(req,res)
        .then(()=>{
            response.success(req,res,'Pdf created');
            })
        .catch((err)=>{
        console.log(err);
        response.error(req,res,'Pdf does not created');
        })
}
function dPdf (req,res){
    managePdf.deletePdf()
        .then(()=>{
            response.success(req,res,'Pdf delete ');
        })
        .catch((err)=>{
            console.log(err);
            response.error(req,res,'Do not pdf delete');
        })
}
function readDataSqlite(req,res){
    mangeSqlite.readData()
        .then((result)=>{
            response.success(req,res,result,200);
        })
        .catch((err)=>{
            response.error(req,res,err,500);
        })
}
module.exports = router;