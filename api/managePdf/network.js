const express = require ('express');
const managePdf = require('./controller');
const response = require('../../network/response');
const manageSqlite = require('../sqlite/controller')

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
            response.success(req,res,'Pdf created',200);
            })
        .catch((err)=>{
        console.log(err);
        response.error(req,res,'Pdf does not created',500);
        })
}
function generatePdfPersonal (req,res){
    managePdf.generatePdfPersonal(req,res)
        .then(()=>{
            response.success(req,res,'Pdf created',200);
            })
        .catch((err)=>{
        console.log(err);
        response.error(req,res,'Pdf does not created',500);
        })
}
function deletePdfVisitors (req,res){
    managePdf.deletePdfVisitors()
        .then(()=>{
            response.success(req,res,'Pdf delete ',200);
        })
        .catch((err)=>{
            console.log(err);
            response.error(req,res,'Do not pdf delete',500);
        })
}
function deletePdfPersonal (req,res){
    managePdf.deletePdfPersonal()
        .then(()=>{
            response.success(req,res,'Pdf delete ',200);
        })
        .catch((err)=>{
            console.log(err);
            response.error(req,res,'Do not pdf delete',500);
        })
}
function synchronizeData(req,res){
    manageSqlite.synchronizeData()
        .then((result)=>{
            response.success(req,res,'Synchronized',200);
        })
        .catch((err)=>{
            console.log(err);
            response.error(req,res,'Do not synchronized',500);
        })
}
function deletedInformationMysql(req,res){
    manageSqlite.deletedInformationMysql()
        .then((result)=>{
            response.success(req,res,'Ok information deleted',200);
        })
        .catch((err)=>{
            console.log(err);
            response.error(req,res,'Do not deleted information',500);
        })
}
module.exports = router;