const store = require('./sqlite');
const controllerMysql = require('../mangeMySql/controller');

const query = ['SELECT entity_id, payload, action FROM synchronizes WHERE is_synchronized = 0 AND entity_code="T001"',
'SELECT entity_id, payload, action FROM synchronizes WHERE is_synchronized = 0 AND entity_code="T006"',]


async function readData(){
    try{
        let result= await store.readTable(query[0]);
        let data = JSON.parse(result[0].payload);
        let result2= await controllerMysql.writeProject('project',data);
        return true;
        /* let result2 = await store.readTable(query[1]);
        console.log(result2); */
    }catch(error){
        return error;
    }
}
module.exports = {
    readData,
}