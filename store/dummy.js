db ={
    'visitors':[
        {
            visitor_id:'1',
            tenant_id:'4',
            dni:'21212121',
            first_name:'Angel',
            last_name:'Centeni',
            status:'1',
            client_project_id:'1'
        },
        {
            visitor_id:'2',
            tenant_id:'4',
            dni:'43793146',
            first_name:'Carlos',
            last_name:'Yaco',
            status:'1',
            client_project_id:'1'
        },
        {
            visitor_id:'3',
            tenant_id:'4',
            dni:'23232323',
            first_name:'Juan',
            last_name:'Quispe',
            status:'1',
            client_project_id:'1'
        }
    ],
    'visitor_details':[
        {
            visitor_detail_id:'1',
            tenant_id:'4',
            date:'2020-12-20',
            time:'8:20am',
            temperature:'35.6',
            reason:'visita',
            observation:'ninguna',
            is_deeleted:'0',
            visitor_id:'1',
        },
        {
            visitor_detail_id:'2',
            tenant_id:'4',
            date:'2020-12-20',
            time:'9:20am',
            temperature:'36.6',
            reason:'visita2',
            observation:'ninguna',
            is_deeleted:'0',
            visitor_id:'1',
        },
        {
            visitor_detail_id:'3',
            tenant_id:'4',
            date:'2020-12-20',
            time:'10:20am',
            temperature:'37.6',
            reason:'visita3',
            observation:'ninguna',
            is_deeleted:'0',
            visitor_id:'1',
        }
    ],
    'user':[{
        tenant_id:'',
        name:'Carlos Yaco',
        username:'43793146',
        email:'cyaco33@gmail.com',
        licence_key:'',
        licence_type:'Free',
        entity:'Independiente',
        is_deleted:'0',
        code_verification:''
    }

    ]
}
async function list(table){
    return db[table]||[]
}
class ServicesMocks {
    async upsert(){
        return new Promise.resolve(db[user]);
    }
    async update(){
        return new Promise.resolve(db[user]);
    }
}

module.exports = {
    list,
    ServicesMocks
}