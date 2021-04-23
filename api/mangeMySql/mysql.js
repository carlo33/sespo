const mysql = require('mysql');
const config = require('../../config');
const dbconfig = {
    host:config.mysql.host,
    user:config.mysql.user,
    password:config.mysql.password,
    database:config.mysql.database,
}
let connection;
function handleConnection(){
    connection = mysql.createConnection(dbconfig);
    connection.connect((err)=>{
        if(err){
            console.log('[db err]',err);
            setTimeout(handleConnection,2000);
        }else{
            console.log('Db connected');
        }
    })
////////////////////////////////////////////////////
    connection.on('error',err=>{
        console.log('[db err]',err);
        if(err.code==='PROTOCOL_CONNECTION_LOST'){
            handleConnection();
        }else{
            throw err;
        }
    })
}
handleConnection();
////////////////////////////////////////////////////
function insert(table,data){
    return new Promise((resolve,reject)=>{
        connection.query(`INSERT INTO ${table} SET ?`,data,(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}
////////////////////////////////////////////////////
function list(table,tenantId,projectId,monthSelect,yearSelect){
    return new Promise((resolve,reject)=>{
        connection.query(`SELECT *, DATE_FORMAT(date,'%d/%m/%y') AS date_format FROM ${table} WHERE MONTH(date)=${monthSelect} AND YEAR(date)=${yearSelect} AND client_project_id=${projectId} AND tenant_id=${tenantId}`,(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}
////////////////////////////////////////////////////
function listVisitors(tenantId,projectId,monthSelect,yearSelect){
    return new Promise((resolve,reject)=>{
        connection.query(`SELECT A.visitor_id, A.first_name, A.last_name, A.dni FROM visitor A LEFT JOIN visitor_details B ON A.visitor_id=B.visitor_id WHERE MONTH(B.date)=${monthSelect} AND YEAR(B.date)=${yearSelect} AND B.client_project_id =${projectId} AND B.tenant_id=${tenantId}`,(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}
////////////////////////////////////////////////////
function updateProject(table, data, clientProjectId){
    return new Promise((resolve,reject)=>{
        connection.query(`UPDATE ${table} SET ? WHERE client_project_id=${clientProjectId}`,[data],(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}

////////////////////////////////////////////////////
function updateTypeId(table, data,typeId, clientProjectId,Id){
    return new Promise((resolve,reject)=>{
        connection.query(`UPDATE ${table} SET ? WHERE ${typeId}=${Id} AND client_project_id=${clientProjectId}`,[data],(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}
////////////////////////////////////////////////////
function updatePersonQuestion(table,newAnswer,clientProjectId,personId,daySelect,monthSelect,yearSelect,personalQuestionId){
    return new Promise((resolve,reject)=>{
        connection.query(`UPDATE ${table} SET answer=${newAnswer} WHERE client_project_id=${clientProjectId} AND personal_id=${personId} AND DAY(date)=${daySelect} AND MONTH(date)=${monthSelect} AND YEAR(date)=${yearSelect} AND personal_question_id=${personalQuestionId}`,(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}

////////////////////////////////////////////////////
function deleteProject(table, clientProjectId){
    return new Promise((resolve,reject)=>{
        connection.query(`UPDATE ${table} SET is_deleted=1 WHERE client_project_id=${clientProjectId}`,(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}
////////////////////////////////////////////////////
function deleteTypeId(table, typeId,clientProjectId,Id){
    return new Promise((resolve,reject)=>{
        connection.query(`UPDATE ${table} SET is_deleted=1 WHERE ${typeId}=${Id} AND client_project_id=${clientProjectId}`,(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}
////////////////////////////////////////////////////
function deletePersonQuestion(table,clientProjectId,personId,daySelect,monthSelect,yearSelect,personalQuestionId){
    return new Promise((resolve,reject)=>{
        connection.query(`UPDATE ${table} SET is_deleted=1 WHERE client_project_id=${clientProjectId} AND personal_id=${personId} AND DAY(date)=${daySelect} AND MONTH(date)=${monthSelect} AND YEAR(date)=${yearSelect} AND personal_question_id=${personalQuestionId}`,(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}
////////////////////////////////////////////////////
function getNameProject(table,tenantId,projectId,){
    return new Promise((resolve,reject)=>{
        connection.query(`SELECT name FROM ${table} WHERE client_project_id='${projectId}' AND tenant_id='${tenantId}'`,(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}
////////////////////////////////////////////////////
function getHeaderPdfPersonal(tenantId,projectId,personalId){
    return new Promise((resolve,reject)=>{
        connection.query(`SELECT A.first_name, A.last_name, A.dni, B.name FROM personal A LEFT JOIN project B ON A.client_project_id=B.client_project_id WHERE A.personal_id=${personalId} AND A.client_project_id = ${projectId} AND A.tenant_id=${tenantId}`,(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}
////////////////////////////////////////////////////
function getQuestions(tenantId,projectId){
    return new Promise((resolve,reject)=>{
        connection.query(`SELECT description, question_id FROM questions WHERE tenant_id=${tenantId} AND client_project_id = ${projectId}`,(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}
////////////////////////////////////////////////////
function  getDaysOfMonthForPeronal(tenantId,projectId,personalId,month,year){
    return new Promise((resolve,reject)=>{
        connection.query(`SELECT  DATE_FORMAT(A.date,'%d'), A.moment FROM person_question A LEFT JOIN personal B ON A.personal_id=B.personal_id WHERE B.tenant_id=${tenantId}  AND B.client_project_id = ${projectId} AND B.personal_id=${personalId} AND YEAR(A.date)=${year} AND MONTH(A.date)=${month} GROUP BY A.date, A.moment;`,(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}
////////////////////////////////////////////////////

function getAnswerPersonal(tenantId,projectId,personalId,month,year,day,moment){
    return new Promise((resolve,reject)=>{
        connection.query(`SELECT A.answer, A.question_id FROM person_question A LEFT JOIN personal B ON A.personal_id=B.personal_id WHERE B.tenant_id=${tenantId}  AND B.client_project_id = ${projectId} AND B.personal_id=${personalId} AND YEAR(A.date)=${year} AND MONTH(A.date)=${month} AND DAY(A.date)=${day} AND moment=${moment};`,(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}
////////////////////////////////////////////////////
function deletedTables(table){
    return new Promise((resolve,reject)=>{
        connection.query(`DELETE  FROM ${table}`,(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}
////////////////////////////////////////////////////
module.exports={
    insert,
    listVisitors,
    list,
    updateProject,
    updateTypeId,
    updatePersonQuestion,
    deleteProject,
    deleteTypeId,
    deletePersonQuestion,
    deletedTables,
    getNameProject,
    getHeaderPdfPersonal,
    getQuestions,
    getAnswerPersonal,
    getDaysOfMonthForPeronal,
}