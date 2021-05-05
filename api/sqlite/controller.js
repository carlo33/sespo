const store = require('./sqlite');
const storeMysql = require('../MySql/mysql');
const formatData = require('../MySql/formatData'); 
const error = require('../../utils/error');

const query = ['SELECT entity_id, payload, action FROM synchronizes WHERE is_synchronized = 0 AND entity_code="T001"',
'SELECT entity_id, payload, action FROM synchronizes WHERE is_synchronized = 0 AND entity_code="T006"',
'SELECT entity_id, payload, action FROM synchronizes WHERE is_synchronized = 0 AND entity_code="T004"',
'SELECT entity_id, payload, action FROM synchronizes WHERE is_synchronized = 0 AND entity_code="T005"',
'SELECT entity_id, payload, action FROM synchronizes WHERE is_synchronized = 0 AND entity_code="T008"',
'SELECT entity_id, payload, action FROM synchronizes WHERE is_synchronized = 0 AND entity_code="T003"'];
const nameTables = ['project','questions','personal','visitor','visitor_details','person_question'];
async function synchronizeData(req,res){
    let db;
    await store.connecteSqlite()
        .then((result)=>{
            db=result;
        })
        .catch((err)=>{
            return err;
        })
    try{
        let projectId='';
        let typeId='';
        let visitorId='';
        let projectIdVisitors='';
        let personalId='';
        let questionId='';
        for (let q=0;q<query.length;q++){
            let data={};
            let dataSqlite= await store.readTable(query[q],db);
            for(let i=0;i<dataSqlite.length;i++){
                let predata = JSON.parse(dataSqlite[i].payload);
                let tenantId = predata.tenant_id;
                console.log('[tenantID]:',tenantId);
                data =  formatData.formatData(nameTables[q],predata);
                switch (dataSqlite[i].action){
                    case 'CREATE':
                        await storeMysql.insert(nameTables[q],data);
                        break;
                    case 'UPDATE':
                        switch (nameTables[q]){
                            case 'project':
                                await storeMysql.updateProject(nameTables[q],data,tenantId);
                                break;
                            case 'visitor':
                                visitorId= data.visitor_id;
                                projectIdVisitors=data.client_project_id;
                                await storeMysql.updateVisitors(data,tenantId,projectIdVisitors,visitorId);
                                break;
                            case 'visitor_details':
                                visitorId= data.visitor_id;
                                await storeMysql.updateVisitorDetails(data,tenantId,projectIdVisitors,visitorId);
                                break;
                            case 'questions':
                                typeId = 'question_id';
                                questionId = data.question_id;
                                projectId=data.client_project_id;
                                await storeMysql.updateTypeId(nameTables[q],data,typeId,questionId,tenantId,projectId);
                                break;
                            case 'personal':
                                typeId = 'personal_id';
                                personalId = data.personal_id;
                                projectId=data.client_project_id;
                                await storeMysql.updateTypeId(nameTables[q],data,typeId,personalId,tenantId,projectId);
                                break;
                            case 'person_question':
                                let date =data.date;
                                let newDate =date.split('-',3);
                                let yearSelect=parseInt(newDate[0]);
                                let monthSelect = parseInt(newDate[1]);
                                let daySelect = parseInt(newDate[2]);
                                personalId=data.personal_id;
                                let result = await storeMysql.getProjectIdForPersonal(tenantId,personalId);
                                projectId= [result[0].client_project_id];
                                console.log('[porjectId get]',projectId);
                                //projectId=data.client_project_id;
                                let personalQuestionId = data.personal_question_id;
                                let newAnswer = data.answer;
                                await storeMysql.updatePersonQuestion(tenantId,projectId,personalId,daySelect,monthSelect,yearSelect,personalQuestionId,newAnswer);
                                break;
                            default:
                                throw error('error update data',500);
                        }
                        break;
                    case 'DELETE':
                        switch (nameTables[q]){
                            case 'project':
                                projectId=data.client_project_id;
                                await storeMysql.deleteProject(tenantId,projectId);
                                break;
                            case 'visitor':
                                projectIdVisitors=data.client_project_id;
                                visitorId=data.visitor_id;
                                console.log(tenantId,projectIdVisitors,visitorId);
                                await storeMysql.deleteVisitors(tenantId,projectIdVisitors,visitorId);
                                break;
                            case 'visitor_details':
                                visitorId= data.visitor_id;
                                await storeMysql.deleteVisitorDetails(tenantId,projectIdVisitors,visitorId);
                                break;
                            case 'questions':
                                typeId = 'question_id';
                                projectId=data.client_project_id;
                                questionId= data.question_id;
                                await storeMysql.deleteTypeId(nameTables[q],tenantId,projectId,typeId,questionId);
                                break;
                            case 'personal':
                                typeId = 'personal_id';
                                projectId=data.client_project_id;
                                personalId = data.personal_id;
                                await storeMysql.deleteTypeId(nameTables[q],tenantId,projectId,typeId,personalId);
                                break;
                            case 'person_question':
                                let date =data.date;
                                let newDate =date.split('-',3);
                                let yearSelect=parseInt(newDate[0]);
                                let monthSelect = parseInt(newDate[1]);
                                let daySelect = parseInt(newDate[2]);
                                personalId=data.personal_id;
                                projectId=data.client_project_id;
                                let personalQuestionId = data.personal_question_id;
                                await storeMysql.deletePersonQuestion(tenantId,projectId,personalId,daySelect,monthSelect,yearSelect,personalQuestionId);
                                break;
                            default:
                                throw error('internal server error',500);
                        }
                        break;
                    default: 
                        throw error('internal server error',500);
                    }
            }
        }
        return true
    }catch(err){
        throw error(err,500);
    } 
}
async function readTenantId(){
    const q = 'SELECT payload FROM synchronizes WHERE  entity_code="T001"';
    let isConnected = false;
    let db;
    await store.connecteSqlite()
        .then((result)=>{
            db=result;
            isConnected=true;
        })
        .catch((err)=>{
            return err;
        })
    if(isConnected == true){
        let response = await store.readTable(q,db);
        let payload =JSON.parse(response[0].payload); 
        return payload;
    }else{
        return new Error('no connected');
}   
}
async function deletedInformationMysql(req,res){
    await storeMysql.deletedTables(nameTables[5]);
    await storeMysql.deletedTables(nameTables[4]);
    await storeMysql.deletedTables(nameTables[3]);
    await storeMysql.deletedTables(nameTables[2]);
    await storeMysql.deletedTables(nameTables[1]);
    await storeMysql.deletedTables(nameTables[0]);
    return true
}
module.exports = {
    synchronizeData,
    deletedInformationMysql,
    readTenantId,
}