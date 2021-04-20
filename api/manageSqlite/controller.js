const store = require('./sqlite');
const controllerMysql = require('../mangeMySql/controller');
const formatData = require('../mangeMySql/formatData'); 
const config = require('../../config');

const query = ['SELECT entity_id, payload, action FROM synchronizes WHERE is_synchronized = 0 AND entity_code="T001"',
'SELECT entity_id, payload, action FROM synchronizes WHERE is_synchronized = 0 AND entity_code="T005"',
'SELECT entity_id, payload, action FROM synchronizes WHERE is_synchronized = 0 AND entity_code="T008"'];
const nameTables = ['project','visitor','visitor_details'];

async function synchronizeData(req,res){
    try{
        for (let q=0;q<query.length;q++){
            let data={};
            let dataSqlite= await store.readTable(query[q]);
            let clientProjectId=config.api.project;
            console.log(dataSqlite);
            if (dataSqlite.length>1){
                for(let i=0;i<dataSqlite.length;i++){
                    let predata = JSON.parse(dataSqlite[i].payload);
                    let visitorId= predata.visitor_id;
                    switch (dataSqlite[i].action){
                        case 'CREATE':
                            data =  formatData.formatData(nameTables[q],predata);
                            console.log(nameTables[q],data);
                            await controllerMysql.writeMysql(nameTables[q],data);
                            break;
                        case 'UPDATE':
                            data =formatData.formatData(nameTables[q],predata);
                            await controllerMysql.updateMysql(nameTables[q],data,clientProjectId,visitorId);
                            break;
                        case 'DELETE':
                            await controllerMysql.deletedMysql(nameTables[q],clientProjectId,visitorId);
                            break;
                        default: 
                        throw new Error ('Action invalided');
                    }
                }
            }else{
                let predata = JSON.parse(dataSqlite[0].payload);
                data =  formatData.formatData(nameTables[q],predata)
                console.log(nameTables[q],data);
                await controllerMysql.writeMysql(nameTables[q],data);
            }
        }
        return true;
    }catch(error){
        return error;
    }
}
module.exports = {
    synchronizeData,
}