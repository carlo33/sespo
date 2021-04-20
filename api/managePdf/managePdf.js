const PdfPrinter = require('pdfmake');
const fs = require('fs');
const config = require('../../config');

let fonts = require('./pdf/fonts');
const  styles = require('./pdf/styles');
const contentPdf = require('./pdf/content');
const controller = require('./controller');
const response = require('../../network/response');

async function generatePdfVisitors(req,res){
    let nameProject ='';
    let dataVisitors=[];
    let dataVisitorDetails=[];
    ////////////////////////////////////////////////Read name project
    let clientProjectId=config.api.project;
    await controller.getNameProject(clientProjectId)
        .then((result)=>{
            let [{name:name}]=result;
            console.log('nombre del proyecto',name);
            nameProject=name;
        })
        .catch((err)=>{
            response.error(req,res,'no se encontraron datos')
        })
    ////////////////////////////////////////////////Read table vistor_details
    await controller.listVisitorDetails(req.body)
    .then((result)=>{
        dataVisitorDetails=result;
        console.log('result Visitor details:',dataVisitorDetails);
    })
    .catch((err)=>{
        response.error(req,res,'no se encontraro datos');
    })    
    ////////////////////////////////////////////////Read table visitors
    await controller.listVisitors()
        .then((result)=>{
            dataVisitors=result;
            console.log('result Visitor :',dataVisitors);
        })
        .catch((err)=>{
            response.error(req,res,'no se encontraron datos')
        })
    ////////////////////////////////////////////////Join tables 
    function getIdOfVisitors(data){
        let arrayIds = [];
        data.filter(item=> arrayIds.push(item['visitor_id']))
        return arrayIds;
    }
    function searchIdVisitor(visitorId,table){
        let key = 'visitor_id';
        return table.filter(item=>item[key]===visitorId);
    }
    //////////////////////////////////////////////new Format date 
    function getDateFormatPdf(date){
        return date
    }
    //////////////////////////////////////////////new Format data
    console.log('comenzado proceso');
    let dataPdfRows = [];
    let dateFormatToPdf='';
    dataPdfRows.push(['Item','Apellidos y Nombres','DNI','Fecha','Hora','Temp.','Motivo de visita','Observación']);
    let arrayIdVisitors=getIdOfVisitors(dataVisitorDetails);
    for (let visitorId of arrayIdVisitors ){
        let [{last_name:lastName,first_name:firstName,dni:dni}] =searchIdVisitor(visitorId,dataVisitors);
        let [{date_format:date,time:time,temperature:temperature,reason:reason,observation:observation}] =searchIdVisitor(visitorId,dataVisitorDetails);
        dateFormatToPdf= getDateFormatPdf(date);
        dataPdfRows.push([`${visitorId}`,`${lastName} ${firstName}`,`${dni}`,`${dateFormatToPdf}`,`${time}`,`${temperature}`,`${reason}`,`${observation}`]);
    }
    console.log('resultado final:');
    console.log(dataPdfRows);
    ///////////////////////////////////////////////Generate pdf
    let content = contentPdf.generateContent(nameProject,dataPdfRows)
    let docDefinition = {
        content:content,
        pageOrientation:'landscape',
        styles:styles,
    }
    const printer = new PdfPrinter(fonts);
    let pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(fs.createWriteStream('pdfs/pdfTest.pdf'));
    pdfDoc.end();
    return true;
}
async function deletePdf(){
    fs.unlink('pdfs/pdfTest.pdf',(err)=>{
        if(err) return err;
        console.log('File removed')
        return true;
    })
}

module.exports = {
    generatePdfVisitors,
    deletePdf,
}
