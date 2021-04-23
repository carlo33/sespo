const express = require ('express');
const managePdf = require('./managePdf');
const response = require('../../network/response');
const manageSqlite = require('../manageSqlite/controller')

const router =express.Router();
//Router
router.get('/pdfVisitors',generatePdfVisitors);
router.get('/pdfPersonal',generatePdfPersonal);
router.get('/sqlite',synchronizeData);
router.delete('/deletePdfVisitors',deletePdfVisitors);
router.delete('/deletePdfPersonal',deletePdfPersonal);
router.delete('/mysql',deletedInformationMysql);

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
function generatePdfPersonal (req,res){
    managePdf.generatePdfPersonal(req,res)
        .then(()=>{
            response.success(req,res,'Pdf created');
            })
        .catch((err)=>{
        console.log(err);
        response.error(req,res,'Pdf does not created');
        })
}
function deletePdfVisitors (req,res){
    managePdf.deletePdfVisitors()
        .then(()=>{
            response.success(req,res,'Pdf delete ');
        })
        .catch((err)=>{
            console.log(err);
            response.error(req,res,'Do not pdf delete');
        })
}
function deletePdfPersonal (req,res){
    managePdf.deletePdfPersonal()
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
function deletedInformationMysql(req,res){
    manageSqlite.deletedInformationMysql()
        .then((result)=>{
            response.success(req,res,result,200);
        })
        .catch((err)=>{
            response.error(req,res,err,500);
        })
}
module.exports = router;