const PdfPrinter = require('pdfmake');
const fs = require('fs');

let fonts = require('./pdf/fonts');
const  styles = require('./pdf/styles');
const contentPdf = require('./pdf/content');
const controller = require('./controller');
const response = require('../../network/response');

async function generatePdf(req,res){
    ////////////////////////////////////////////////READ DATA TABLE VISITORS
    let dataVisitors=[];
    let dataVisitorDetails=[];
    await controller.listVisitors()
        .then((result)=>{
            dataVisitors=result;
            console.log('result Visitor :',dataVisitors);
        })
        .catch((err)=>{
            response.error(req,res,'no se encontraron datos')
        })
    ////////////////////////////////////////////////READ DATA TABLE VISITOR-DETAILS 
    await controller.listVisitorDetails()
        .then((result)=>{
            dataVisitorDetails=result;
            console.log('result Visitor details:',dataVisitorDetails);
        })
        .catch((err)=>{
            response.error(req,res,'no se encontraro datos');
        })     
    ////////////////////////////////////////////////JOIN DATA
    function getIdOfVisitors(data){
        let arrayIds = [];
        data.filter(item=> arrayIds.push(item['visitor_id']))
        return arrayIds;
    }
    function searchIdVisitor(visitorId,table){
        let key = 'visitor_id';
        return table.filter(item=>item[key]===visitorId);
    }
    //////////////////////////////////////////////
    console.log('comenzado proceso');
    let dataPdfRows = []
    dataPdfRows.push(['Item','Apellidos y Nombres','DNI','Fecha','Hora','Temp.','Motivo de visita','Observación']);
    let arrayIdVisitors=getIdOfVisitors(dataVisitors);
    for (let visitorId of arrayIdVisitors ){
        let [{last_name:lastName,first_name:firstName,dni:dni}] =searchIdVisitor(visitorId,dataVisitors);
        let [{date:date,temperature:temperature,reason:reason,observation:observation}] =searchIdVisitor(visitorId,dataVisitorDetails);
        dataPdfRows.push([`${visitorId}`,`${lastName} ${firstName}`,`${dni}`,`${date}`,`${date}`,`${temperature}`,`${reason}`,`${observation}`]);
    }
    console.log('resultado final:');
    console.log(dataPdfRows);
    ///////////////////////////////////////////////GENERATE PDF
    let content = contentPdf.generateContent(dataPdfRows)
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
    generatePdf,
    deletePdf,
}
