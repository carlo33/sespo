const express = require ('express');
const controllerPdf = require('./controller');
const response = require('../../network/response');
const controllerSqlite = require('../sqlite/controller')
const secure = require('./secure');

const router =express.Router();
//Router
router.get('/sqlite',secure('synchronize'),synchronizeData);
/////
router.get('/pdfVisitors',generatePdfVisitors);
router.get('/pdfPersonal',generatePdfPersonal);
router.delete('/deletePdfVisitors',deletePdfVisitors);
router.delete('/deletePdfPersonal',deletePdfPersonal);
router.delete('/mysql',deletedInformationMysql);

function generatePdfVisitors (req,res){
    controllerPdf.generatePdfVisitors(req,res)
        .then(()=>{
            response.success(req,res,'Pdf created',200);
            })
        .catch((err)=>{
        console.log(err);
        response.error(req,res,'Pdf does not created',500);
        })
}
function generatePdfPersonal (req,res){
    controllerPdf.generatePdfPersonal(req,res)
        .then(()=>{
            response.success(req,res,'Pdf created',200);
            })
        .catch((err)=>{
        console.log(err);
        response.error(req,res,'Pdf does not created',500);
        })
}
function deletePdfVisitors (req,res){
    controllerPdf.deletePdfVisitors()
        .then(()=>{
            response.success(req,res,'Pdf delete ',200);
        })
        .catch((err)=>{
            console.log(err);
            response.error(req,res,'Do not pdf delete',500);
        })
}
function deletePdfPersonal (req,res){
    controllerPdf.deletePdfPersonal()
        .then(()=>{
            response.success(req,res,'Pdf delete ',200);
        })
        .catch((err)=>{
            console.log(err);
            response.error(req,res,'Do not pdf delete',500);
        })
}
function synchronizeData(req,res){
    controllerSqlite.synchronizeData()
        .then(()=>{
            response.success(req,res,'Synchronized',200);
        })
        .catch((err)=>{
            console.log(err);
            response.error(req,res,'Do not synchronized',500);
        })
}
function deletedInformationMysql(req,res){
    controllerSqlite.deletedInformationMysql()
        .then((result)=>{
            response.success(req,res,'Ok information deleted',200);
        })
        .catch((err)=>{
            console.log(err);
            response.error(req,res,'Do not deleted information',500);
        })
}
module.exports = router;