const store = require('./sqlite');
const controllerMysql = require('../mangeMySql/controller');
const manageData = require('../mangeMySql/manageData'); 

const query = ['SELECT entity_id, payload, action FROM synchronizes WHERE is_synchronized = 0 AND entity_code="T001"',
'SELECT entity_id, payload, action FROM synchronizes WHERE is_synchronized = 0 AND entity_code="T005"'];
const nameTables = ['project','visitor'];

async function readData(){
    try{
        for (let q=0;q<query.length;q++){
            let data={};
            let dataSqlite= await store.readTable(query[q]);
            if (dataSqlite.length>1){
                for(let i=0;i<dataSqlite.length;i++){
                    let predata = JSON.parse(dataSqlite[i].payload);
                    data =  manageData.formatData(nameTables[q],predata)
                    console.log(nameTables[q],data);
                    await controllerMysql.writeMysql(nameTables[q],data);
                }
            }else{
                let predata = JSON.parse(dataSqlite[0].payload);
                //console.log(nameTables[q],predata);
                data =  manageData.formatData(nameTables[q],predata)
                console.log(nameTables[q],data);
                await controllerMysql.writeMysql(nameTables[q],data);
            }
            //console.log(dataSqlite);
        }
        /* let data2 = JSON.parse(result2[0].payload);
        await controllerMysql.writeVisitor('visitor',data2); */
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