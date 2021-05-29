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
    await store.getNameProject('project',req.body.tenant_id,req.body.project_id)
        .then((result)=>{
            let [{name:name}]=result;
            nameProject=name;
        })
        .catch((err)=>{
            console.log('[Error get name porject]:',err);
            response.error(req,res,'Not find data')
        })
    ////Read tables visitors and vistitors details
    await store.listVisitors(req.body.tenant_id,req.body.project_id,req.body.month,req.body.year)
        .then((result)=>{
            dataVisitors=result;
            console.log('[Result Visitor] :',dataVisitors);
        })
        .catch((err)=>{
            console.log('[Error get visitors]',err);
            response.error(req,res,'Not find data')
        })
    let dataPdfRows = [];
    dataPdfRows.push(['Item','Apellidos y Nombres','DNI','Fecha','Hora','Temp.','Motivo de visita','Observación']);
    let i = 1;
    for (let visitorId of dataVisitors){
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
    let amountQuestions;
    let headerQuestions=['Fecha','Desc.'];
    let spacesColumnsPdf=[70,50];
    let numberQuestion=0;
    ////Read name,personal,dni
    await store.getHeaderPdfPersonal(req.body.tenant_id,req.body.project_id,req.body.personal_id)
        .then((result)=>{
            console.log(result);
            let [{ name:project,first_name:firstName,last_name:lastName,dni:dni}]=result;
            namePersonal=firstName +' '+ lastName;
            nameProject=project;
            numberDni=dni;
        })
        .catch((err)=>{
            console.log('[Error get header pdf personal]',err);
            response.error(req,res,'Not find data')
        })
    ////Read questions
    await store.getQuestions(req.body.tenant_id,req.body.project_id)
        .then((results)=>{
            for (let result of results ){
                numberQuestion++;
                let {description:description}=result;
                questions.push(['P'+numberQuestion,description]);
            } 
            numberQuestion=0;
        })
        .catch((err)=>{
            console.log('[Error get questions]',err);
            response.error(req,res,'Not find data')
        })
    console.log('[Result Questions]:',questions);
    amountQuestions =  questions.length;
    let spaceColumnQuestion = Math.round(520/amountQuestions);
    for(let i =0; i<amountQuestions;i++){
        headerQuestions.push(questions[i][0])  
        spacesColumnsPdf.push(spaceColumnQuestion)
    }
    dataPersonAnswer.push(headerQuestions);
    console.log('[Result]',dataPersonAnswer);
    console.log('[Array]',spacesColumnsPdf);
    /////format questions
    let formatQuestions=[];
    let halfNumberQuestions=Math.round(questions.length/2);
    for(let i=0;i<halfNumberQuestions;i++){
        if(halfNumberQuestions+i==questions.length){
            formatQuestions[i]=questions[i].concat(' ',' ');
        }else{
            formatQuestions[i]=questions[i].concat(questions[halfNumberQuestions+i]);
        }
    }
    console.log('[Result Questions]:',formatQuestions);
    ////Read day of month for personal
    await store.getDaysOfMonthForPersonal(req.body.tenant_id,req.body.project_id,req.body.personal_id,req.body.month,req.body.year)
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
        throw error('Error abouts moment',500);
    }
    
    let indexMoment=0;
    for (let day of daysOfPersonal){
        let rowAnswerTemporal=[];
        rowAnswerTemporal[0]=day+'-'+req.body.month+'-'+req.body.year;
        if(momentsOfDay[indexMoment]=='0'){
            rowAnswerTemporal[1]='Entrada';
        }else{
            rowAnswerTemporal[1]='Salida';
        }
        await store.getAnswerPersonal(req.body.tenant_id,req.body.project_id,req.body.personal_id,req.body.month,req.body.year,day,momentsOfDay[indexMoment])
        .then((results)=>{
            console.log('[data]',results)
            for(let result of results){
                let {answer:answer}=result;
                rowAnswerTemporal[numberQuestion+2]=answer;
                numberQuestion++;
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
    let content = contentPdf.structureContentPdfPersonal(nameProject,namePersonal,numberDni,dataPersonAnswer,formatQuestions,spacesColumnsPdf)
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
