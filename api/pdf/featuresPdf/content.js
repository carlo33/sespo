function structureContentPdfVisitors(nameProject,rows){
    let content= [
        {
            text:"FORMATO DE REGISTRO DE VISITAS", 
            style:"header",
        },
        {
            text:`Proyecto/Entidad: ${nameProject}`,
            style:"subheader",
        },
        {
            style:'tableExample',
            table:{
                widths: [50,200,70,80,50,50,100,100],
                body: rows
            },
            layout:{
                fillColor:function(rowIndex){
                    return (rowIndex==0) ? '#cccccc': null;
                }
            },
        },
    ];
    return content;
}
function structureContentPdfPersonal(nameProject,namePersonal,dni,rows,headerRows,questions){
    let content= [
        {
            text:"FORMATO DE CONTROL DIARIO DE PERSONAL", 
            style:"header",
        },
        {
            text:`Proyecto/Entidad: ${nameProject}`,
            style:"subheader",
        },
        {
            text:`Personal: ${namePersonal}`,
            style:"subheader",
        },
        {
            text:`DNI: ${dni}`,
            style:"subheader",
        },
        {
            style:'tableExample',
            table:{
                widths: headerRows,
                body: rows
            }, 
            layout:{
                fillColor:function(rowIndex){
                    return (rowIndex==0) ? '#cccccc': null;
                }
            },
        },
        {
            style:'tableExample',
            table:{
                widths: [50,'*',50,'*'],
                body: questions
            },
            layout:'noBorders'
        } 
    ];
    return content;
}
module.exports = {
    structureContentPdfVisitors,
    structureContentPdfPersonal,
}