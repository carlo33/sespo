const express = require ('express');
const managePdf = require('./managePdf');
const response = require('../../network/response');
const manageSqlite = require('../manageSqlite/controller')

const router =express.Router();
//Router
router.get('/pdf',generatePdfVisitors);
router.delete('/pdf',dPdf);
router.get('/sqlite',synchronizeData);

function generatePdfVisitors (req,res){
    managePdf.generatePdfVisitors(req,res)
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
function synchronizeData(req,res){
    manageSqlite.synchronizeData()
        .then((result)=>{
            response.success(req,res,result,200);
        })
        .catch((err)=>{
            response.error(req,res,err,500);
        })
}
module.exports = router;