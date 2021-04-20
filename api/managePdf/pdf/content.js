function generateContent(nameProject,rows){
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
module.exports = {
    generateContent,
}