const PdfPrinter = require('pdfmake');
const fs = require('fs');

let fonts = require('./featuresPdf/fonts');
const  styles = require('./featuresPdf/styles');
const contentPdf = require('./featuresPdf/content');
const response = require('../../network/response');
const store = require('../MySql/mysql');
const error = require('../../utils/error');
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function generatePdfVisitors(req,res){
    let nameProject ='';
    let dataVisitors=[];
    /////Read name project
    await store.getNameProject('project',req.body.tenantId,req.body.projectId)
        .then((result)=>{
            let [{name:name}]=result;
            nameProject=name;
        })
        .catch((err)=>{
            console.log('[obtain name porject]:',err);
            response.error(req,res,'Not find data')
        })
    ////Read tables visitors and vistitors details
    await store.listVisitors(req.body.tenantId,req.body.projectId,req.body.month,req.body.year)
        .then((result)=>{
            dataVisitors=result;
            console.log('[Result Visitor] :',dataVisitors);
        })
        .catch((err)=>{
            console.log(err);
            response.error(req,res,'Not find data')
        })
    let dataPdfRows = [];
    dataPdfRows.push(['Item','Apellidos y Nombres','DNI','Fecha','Hora','Temp.','Motivo de visita','Observación']);
    for (let visitorId of dataVisitors){
        let i = 1;
        let {last_name:lastName,first_name:firstName,dni:dni,date_format:date,time:time,temperature:temperature,reason:reason,observation:observation} = visitorId
        dataPdfRows.push([`${i}`,`${lastName} ${firstName}`,`${dni}`,`${date}`,`${time}`,`${temperature}`,`${reason}`,`${observation}`]);
        i++;
    }
    console.log('[Result Visitors:]:',dataPdfRows);
    
    /////Generate pdf
    let content = contentPdf.structureContentPdfVisitors(nameProject,dataPdfRows)
    let docDefinition = {
        content:content,
        pageOrientation:'landscape',
        styles:styles,
    }
    const printer = new PdfPrinter(fonts);
    let pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(fs.createWriteStream('pdfs/visitors.pdf'));
    pdfDoc.end();
    return true;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
async function generatePdfPersonal(req,res){
    let nameProject ='';
    let namePersonal ='';
    let numberDni='';
    let questions=[];
    let daysOfPersonal=[];
    let momentsOfDay=[];
    let dataPersonAnswer=[];
    ////Read name,personal,dni
    await store.getHeaderPdfPersonal(req.body.tenantId,req.body.projectId,req.body.personalId)
        .then((result)=>{
            console.log(result);
            let [{ name:project,first_name:firstName,last_name:lastName,dni:dni}]=result;
            namePersonal=firstName +' '+ lastName;
            nameProject=project;
            numberDni=dni;
        })
        .catch((err)=>{
            console.log('[obtain header pdf personal]',err);
            response.error(req,res,'Not find data')
        })
    ////Read questions
    await store.getQuestions(req.body.tenantId,req.body.projectId)
        .then((results)=>{
            for (let result of results ){
                let {description:description,question_id:questionId}=result;
                questions.push(['P'+questionId,description]);
            } 
        })
        .catch((err)=>{
            console.log('[obtain questions]',err);
            response.error(req,res,'Not find data')
        })
    console.log('[Result Questions]:',questions);
    /////format questions
    let formatQuestions=[];
    for(let i=0;i<questions.length/2;i++){
        formatQuestions[i]=questions[i].concat(questions[6+i]);
    }
    console.log('[Result Questions]:',formatQuestions);
    ////Read day of month for personal
    await store.getDaysOfMonthForPersonal(req.body.tenantId,req.body.projectId,req.body.personalId,req.body.month,req.body.year)
        .then((results)=>{
            for(let result of results){
                let {"DATE_FORMAT(A.date,'%d')":day,moment:moment}=result;
                daysOfPersonal.push(day);
                momentsOfDay.push(moment)
            }
        })
        .catch((err)=>{
            console.log('[obtein days of month for personal]',err);
            response.error.apply(req,res,'Not find data')
        }
        )
    console.log('[Result Days - Moment]',daysOfPersonal,momentsOfDay);
    ////Read answer
    if(daysOfPersonal.length!=momentsOfDay.length){
        //throw new Error('Error respecto a los moment');
        throw error('Error abouts moment',500);
    }
    dataPersonAnswer.push(['Fecha','Desc.','P1','P2','P3','P4.','P5','P6','P7','P8','P9','P10.','P11','P12','P13']);
    let indexMoment=0;
    for (let day of daysOfPersonal){
        let rowAnswerTemporal=[];
        rowAnswerTemporal[0]=day+'-'+req.body.month+'-'+req.body.year;
        if(momentsOfDay[indexMoment]=='0'){
            rowAnswerTemporal[1]='Entrada';
        }else{
            rowAnswerTemporal[1]='Salida';
        }
        await store.getAnswerPersonal(req.body.tenantId,req.body.projectId,req.body.personalId,req.body.month,req.body.year,day,momentsOfDay[indexMoment])
        .then((results)=>{
            for(let result of results){
                let {answer:answer,question_id:questionId}=result;
                rowAnswerTemporal[questionId+1]=answer;
            }
        })
        .catch((err)=>{
            console.log('[obtein answer perosnal]:',err);
            response.error(req,res,'Not find data')
        }) 
        indexMoment++;
        dataPersonAnswer.push(rowAnswerTemporal);
    }
    console.log('[Result Personal]:',dataPersonAnswer);
//////Generate pdf
    let content = contentPdf.structureContentPdfPersonal(nameProject,namePersonal,numberDni,dataPersonAnswer,formatQuestions)
    let docDefinition = {
        content:content,
        pageOrientation:'landscape',
        styles:styles,
    }
    const printer = new PdfPrinter(fonts);
    let pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(fs.createWriteStream('pdfs/personal.pdf'));
    pdfDoc.end();
    return true; 
}

async function deletePdfVisitors(){
    fs.unlink('pdfs/visitors.pdf',(err)=>{
        if(err) return err;
        console.log('File removed');
        return true;
    })
}
async function deletePdfPersonal(){
    fs.unlink('pdfs/personal.pdf',(err)=>{
        if(err) return err;
        console.log('File removed');
        return true;
    })
}
async function deleteBdSqlite(){
    fs.unlink('uploads/db.sqlite',(err)=>{
        if(err) return err;
        console.log('Bd removed');
        return true;
    })
}

module.exports = {
    generatePdfVisitors,
    generatePdfPersonal,
    deletePdfVisitors,
    deletePdfPersonal,
    deleteBdSqlite,
}
