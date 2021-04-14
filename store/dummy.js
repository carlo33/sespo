db ={
    'visitors':[
        {
            visitor_id:'1',
            tenant_id:'4',
            dni:'00000002',
            first_name:'angel',
            last_name:'centeni',
            status:'1',
            project_id:'1'
        },
        {
            visitor_id:'2',
            tenant_id:'5',
            dni:'43793146',
            first_name:'carlos',
            last_name:'yaco',
            status:'1',
            project_id:'1'
        },
        {
            visitor_id:'3',
            tenant_id:'6',
            dni:'21212121',
            first_name:'Juan',
            last_name:'Quispe',
            status:'1',
            project_id:'1'
        }
    ],
    'visitor_details':[
        {
            visitor_detail_id:'1',
            tenant_id:'4',
            date:'1608599229',
            temperature:'36.6',
            reason:'visita',
            observation:'ninguna',
            status:'1',
            visitor_id:'1',
        },
        {
            visitor_detail_id:'2',
            tenant_id:'5',
            date:'1608599229',
            temperature:'37.6',
            reason:'visita 2',
            observation:'ninguna 2',
            status:'1',
            visitor_id:'2',
        },
        {
            visitor_detail_id:'3',
            tenant_id:'6',
            date:'1608599229',
            temperature:'38.6',
            reason:'visita 3',
            observation:'ninguna 3',
            status:'1',
            visitor_id:'3',
        }
    ]
}
async function list(table){
    return db[table]||[]
}
module.exports = {
    list,
}