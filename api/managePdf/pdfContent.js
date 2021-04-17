var rows = [];
rows.push(['Item','Apellidos y Nombres','DNI','Fecha','Hora','Temp.','Motivo de visita','Observación']);

for(var i of [1,2,3,4,5]) {
    rows.push(['#.'+i, 'xx', 'xx', 'xx', 'xx', 'xx','xx','xx']);
}


module.exports = {
    content: [
        {
            text:"FORMATO DE REGISTRO DE VISITAS", 
        style:"header",
        },
        {
            text:"Proyecto/Entidad: Nombre del proyecto",
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
        
    ]
};