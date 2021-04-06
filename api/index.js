const express = require('express');
const PdfPrinter = require('pdfmake');
const fs = require('fs');
const config = require('../config');

const app = express();
app.use(express.json());

const fonts = require('./fonts');
const  styles = require('./styles');
const {content} = require('./pdfContent');
//ROUTER
//app.use('/api')

//document definition
let docDefinition = {
  content:content,
  styles:styles,
}

const printer = new PdfPrinter(fonts);

let pdfDoc = printer.createPdfKitDocument(docDefinition);
pdfDoc.pipe(fs.createWriteStream('pdfs/pdfTest.pdf'));
pdfDoc.end();

app.listen(config.api.port, ()=>{
  console.log('API escuchando en el puerto:',config.api.port);
})