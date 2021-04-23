const PdfPrinter = require('pdfmake');
const fs = require('fs');

let fonts = require('./pdf/fonts');
const  styles = require('./pdf/styles');
const contentPdf = require('./pdf/content');
const controller = require('./controller');
const response = require('../../network/response');
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function generatePdfVisitors(req,res){
    let nameProject ='';
    let dataVisitors=[];
    let dataVisitorDetails=[];
    /////Read name project
    await controller.getNameProject(req.body)
        .then((result)=>{
            let [{name:name}]=result;
            nameProject=name;
        })
        .catch((err)=>{
            console.log(err);
            response.error(req,res,'Not find data')
        })
    ////Read table vistor_details
    await controller.listVisitorDetails(req.body)
    .then((result)=>{
        dataVisitorDetails=result;
        console.log('[Result Visitor details]:',dataVisitorDetails);
    })
    .catch((err)=>{
        console.log(err);
        response.error(req,res,'Not find data');
    })    
    ////Read table visitors
    await controller.listVisitors(req.body)
        .then((result)=>{
            dataVisitors=result;
            console.log('[Result Visitor] :',dataVisitors);
        })
        .catch((err)=>{
            console.log(err);
            response.error(req,res,'Not find data')
        })
    ////Join tables 
    function getIdOfVisitors(data){
        let arrayIds = [];
        data.filter(item=> arrayIds.push(item['visitor_id']))
        return arrayIds;
    }
    function searchIdVisitor(visitorId,table){
        let key = 'visitor_id';
        return table.filter(item=>item[key]===visitorId);
    }
    /////new Format data for PDF visitors
    let dataPdfRows = [];
    dataPdfRows.push(['Item','Apellidos y Nombres','DNI','Fecha','Hora','Temp.','Motivo de visita','Observación']);
    let arrayIdVisitors=getIdOfVisitors(dataVisitorDetails);
    for (let visitorId of arrayIdVisitors ){
        let [{last_name:lastName,first_name:firstName,dni:dni}] =searchIdVisitor(visitorId,dataVisitors);
        let [{date_format:date,time:time,temperature:temperature,reason:reason,observation:observation}] =searchIdVisitor(visitorId,dataVisitorDetails);
        dataPdfRows.push([`${visitorId}`,`${lastName} ${firstName}`,`${dni}`,`${date}`,`${time}`,`${temperature}`,`${reason}`,`${observation}`]);
    }
    console.log('[Final Result]:',dataPdfRows);
    /////Generate pdf
    let content = contentPdf.structureContentPdfVisitors(nameProject,dataPdfRows)
    let docDefinition = {
        content:content,
        pageOrientation:'landscape',
        styles:styles,
    }
    const printer = new PdfPrinter(fonts);
    let pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(fs.createWriteStream('pdfs/Visitors.pdf'));
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
    await controller.getHeaderPdfPersonal(req.body)
        .then((result)=>{
            console.log(result);
            let [{ name:project,first_name:firstName,last_name:lastName,dni:dni}]=result;
            namePersonal=firstName +' '+ lastName;
            nameProject=project;
            numberDni=dni;
        })
        .catch((err)=>{
            console.log(err);
            response.error(req,res,'Not find data')
        })
    ////Read questions
    await controller.getQuestions(req.body)
        .then((results)=>{
            for (let result of results ){
                let {description:description,question_id:questionId}=result;
                questions.push(['P'+questionId,description]);
            } 
        })
        .catch((err)=>{
            console.log(err);
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
    await controller.getDaysOfMonthForPeronal(req.body)
        .then((results)=>{
            for(let result of results){
                let {"DATE_FORMAT(A.date,'%d')":day,moment:moment}=result;
                daysOfPersonal.push(day);
                momentsOfDay.push(moment)
            }
        })
        .catch((err)=>{
            console.log(err);
            response.error.apply(req,res,'Not find data')
        }
        )
    console.log('[Result Days - Moment]',daysOfPersonal,momentsOfDay);
    ////Read answer
    if(daysOfPersonal.length!=momentsOfDay.length){
        throw new Error('Error respecto a los moment');
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
        await controller.getAnswerPersonal(req.body,day,momentsOfDay[indexMoment])
        .then((results)=>{
            for(let result of results){
                let {answer:answer,question_id:questionId}=result;
                rowAnswerTemporal[questionId+1]=answer;
            }
        })
        .catch((err)=>{
            console.log(err);
            response.error(req,res,'Not find data')
        }) 
        indexMoment++;
        dataPersonAnswer.push(rowAnswerTemporal);
    }
    console.log('[Result final]:',dataPersonAnswer);
//////Generate pdf
    let content = contentPdf.structureContentPdfPersonal(nameProject,namePersonal,numberDni,dataPersonAnswer,formatQuestions)
    let docDefinition = {
        content:content,
        pageOrientation:'landscape',
        styles:styles,
    }
    const printer = new PdfPrinter(fonts);
    let pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(fs.createWriteStream('pdfs/Personal.pdf'));
    pdfDoc.end();
    return true; 
}

async function deletePdfVisitors(){
    fs.unlink('pdfs/Visitors.pdf',(err)=>{
        if(err) return err;
        console.log('File removed')
        return true;
    })
}
async function deletePdfPersonal(){
    fs.unlink('pdfs/Personal.pdf',(err)=>{
        if(err) return err;
        console.log('File removed')
        return true;
    })
}

module.exports = {
    generatePdfVisitors,
    generatePdfPersonal,
    deletePdfVisitors,
    deletePdfPersonal,
}
