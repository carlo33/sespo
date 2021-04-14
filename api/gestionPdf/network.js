const express = require ('express');
const managePdf = require('./managePdf');
const response = require('../../network/response');

const router =express.Router();
//Router
router.get('/',gPdf);
router.delete('/',dPdf);

function gPdf (req,res){
  managePdf.generatePdf(req,res)
    .then(()=>{
      response.success(req,res,'pdf generado');
    })
    .catch((err)=>{
      console.log(err);
      response.error(req,res,'No se pudo generar el pdf');
    })
}
function dPdf (req,res){
  managePdf.deletePdf()
    .then(()=>{
      response.success(req,res,'pdf eliminado');
    })
    .catch((err)=>{
      console.log(err);
      response.error(req,res,'No se pudo eliminar el pdf');
    })
}

module.exports = router;