const express = require ('express');
const controllerPdf = require('./controller');
const response = require('../../network/response');
const controllerSqlite = require('../sqlite/controller')
const secure = require('./secure');
const router =express.Router();
const multer = require('multer');

//setting receive file
const storage = multer.diskStorage({
    destination:'uploads/',
    filename: function(req,file,cb){
        cb(null,'db.sqlite');
    }
})
const upload = multer({
    storage:storage
})
//Router
router.post('/synchronize',[upload.single(''),secure('synchronize') ],synchronizeData);
router.get('/pdfVisitors',generatePdfVisitors);
router.get('/pdfPersonal',generatePdfPersonal);
/////
router.delete('/deletePdfVisitors',deletePdfVisitors);
router.delete('/deletePdfPersonal',deletePdfPersonal);
router.delete('/deleteBd',deletedBdMysql);
////test
router.delete('/mysql',deletedInformationMysql);
////
function generatePdfVisitors (req,res,next){
    controllerPdf.generatePdfVisitors(req,res)
        .then(()=>{
            response.success(req,res,'Pdf created',200);
            })
        .catch(next)
}
function generatePdfPersonal (req,res,next){
    controllerPdf.generatePdfPersonal(req,res)
        .then(()=>{
            response.success(req,res,'Pdf created',200);
            })
        .catch(next)
}
function deletePdfVisitors (req,res,next){
    controllerPdf.deletePdfVisitors()
        .then(()=>{
            response.success(req,res,'Pdf delete ',200);
        })
        .catch(next)
}
function deletePdfPersonal (req,res,next){
    controllerPdf.deletePdfPersonal()
        .then(()=>{
            response.success(req,res,'Pdf delete ',200);
        })
        .catch(next)
}
function synchronizeData(req,res,next){
    controllerSqlite.synchronizeData()
        .then(()=>{
            console.log('[Finish synchronize]');
            response.success(req,res,'Synchronized',200);
        })
        .catch(next)
}
function deletedInformationMysql(req,res,next){
    controllerSqlite.deletedInformationMysql()
        .then(()=>{
            response.success(req,res,'Ok information deleted',200);
        })
        .catch(next)
}
function deletedBdMysql(req,res,next){
    controllerPdf.deleteBdSqlite()
    .then(()=>{
        response.success(req,res,'Ok BD removed',200);
    })
    .catch(next)
}
module.exports = router;