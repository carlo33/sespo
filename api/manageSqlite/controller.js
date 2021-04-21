const store = require('./sqlite');
const controllerMysql = require('../mangeMySql/controller');
const formatData = require('../mangeMySql/formatData'); 
const config = require('../../config');

const query = ['SELECT entity_id, payload, action FROM synchronizes WHERE is_synchronized = 0 AND entity_code="T001"',
'SELECT entity_id, payload, action FROM synchronizes WHERE is_synchronized = 0 AND entity_code="T005"',
'SELECT entity_id, payload, action FROM synchronizes WHERE is_synchronized = 0 AND entity_code="T008"',
'SELECT entity_id, payload, action FROM synchronizes WHERE is_synchronized = 0 AND entity_code="T006"',
'SELECT entity_id, payload, action FROM synchronizes WHERE is_synchronized = 0 AND entity_code="T004"',
'SELECT entity_id, payload, action FROM synchronizes WHERE is_synchronized = 0 AND entity_code="T003"'];
const nameTables = ['project','visitor','visitor_details','questions','personal','person_question'];
async function synchronizeData(req,res){
    try{
        let clientProjectId=config.api.project;//-----
        let typeId='';
        for (let q=0;q<query.length;q++){
            let data={};
            let dataSqlite= await store.readTable(query[q]);
            console.log(dataSqlite);
            for(let i=0;i<dataSqlite.length;i++){
                let predata = JSON.parse(dataSqlite[i].payload);
                data =  formatData.formatData(nameTables[q],predata);
                switch (dataSqlite[i].action){
                    case 'CREATE':
                        console.log(nameTables[q],data);
                        await controllerMysql.writeMysql(nameTables[q],data);
                        break;
                    case 'UPDATE':
                        switch (nameTables[q]){
                            case 'project':
                                await controllerMysql.updateMysqlProject(nameTables[q],data,clientProjectId);
                                break;
                            case 'visitor':
                            case 'visitor_details':
                                typeId = 'visitor_id';
                                let visitorId= data.visitor_id;
                                await controllerMysql.updateMysqlTypeId(nameTables[q],data,typeId,clientProjectId,visitorId);
                                break;
                            case 'questions':
                                typeId = 'question_id';
                                let questionId = data.question_id;
                                await controllerMysql.updateMysqlTypeId(nameTables[q],data,typeId,clientProjectId,questionId);
                                break;
                            case 'personal':
                                typeId = 'personal_id';
                                let personalId = data.personal_id;
                                await controllerMysql.updateMysqlTypeId(nameTables[q],data,typeId,clientProjectId,personalId);
                                break;
                            case 'person_question':
                                console.log(nameTables[q],data);
                                let date =data.date;
                                let newDate =date.split('-',3);
                                let yearSelect=parseInt(newDate[0]);
                                let monthSelect = parseInt(newDate[1]);
                                let daySelect = parseInt(newDate[2]);
                                let personId=data.personal_id;
                                let personalQuestionId = data.personal_question_id;
                                let newAnswer = data.answer;
                                console.log('llegue hasta aqui');
                                await controllerMysql.updateMysqlPersonQuestion(nameTables[q],newAnswer,clientProjectId,personId,daySelect,monthSelect,yearSelect,personalQuestionId);
                                break;
                            default:
                                throw new Error ('Error to update data');
                        }
                        break;
                    case 'DELETE':
                        switch (nameTables[q]){
                            case 'project':
                                await controllerMysql.deleteMysqlProject(nameTables[q],data,clientProjectId);
                                break;
                            case 'visitor':
                            case 'visitor_details':
                                typeId = 'visitor_id';
                                let visitorId= data.visitor_id;
                                await controllerMysql.deleteMysqlTypeId(nameTables[q],typeId,clientProjectId,visitorId);
                                break;
                            case 'questions':
                                typeId = 'question_id';
                                let questionId= data.question_id;
                                await controllerMysql.deleteMysqlTypeId(nameTables[q],typeId,clientProjectId,questionId);
                                break;
                            case 'personal':
                                typeId = 'personal_id';
                                let personalId = data.personal_id;
                                await controllerMysql.deleteMysqlTypeId(nameTables[q],data,typeId,clientProjectId,personalId);
                                break;
                            default:
                                throw new Error ('Error to delete data');
                        }
                        break;
                    case 'person_question':
                            /* let date =data.date;
                            let newDate =date.split('-',3);
                            let yearSelect=parseInt(newDate[0]);
                            let monthSelect = parseInt(newDate[1]);
                            let daySelect = parseInt(newDate[2]);
                            let personId=data.personal_id;
                            let personalQuestionId = data.personal_question_id;
                            await controllerMysql.deleteMysqlPersonQuestion(nameTables[q],clientProjectId,personId,daySelect,monthSelect,yearSelect,personalQuestionId); */
                            
                            break;
                    default: 
                        throw new Error ('Action invalided');
                    }
                }
        }
        return true;//---
    }catch(error){
        return error;
    }
}
async function deletedInformationMysql(req,res){
    await controllerMysql.deletedTables(nameTables[5]);
    await controllerMysql.deletedTables(nameTables[4]);
    await controllerMysql.deletedTables(nameTables[3]);
    await controllerMysql.deletedTables(nameTables[2]);
    await controllerMysql.deletedTables(nameTables[1]);
    await controllerMysql.deletedTables(nameTables[0]);
    return true
}
module.exports = {
    synchronizeData,
    deletedInformationMysql,
}