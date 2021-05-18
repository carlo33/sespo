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
//////
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
//////
function insert(table,data){
    return new Promise((resolve,reject)=>{
        connection.query(`INSERT INTO ${table} SET ?`,data,(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}
//////-----------------------
function list(table,tenantId,projectId,monthSelect,yearSelect){
    return new Promise((resolve,reject)=>{
        connection.query(`SELECT *, DATE_FORMAT(date,'%d/%m/%y') AS date_format FROM ${table} WHERE MONTH(date)=${monthSelect} AND YEAR(date)=${yearSelect} AND client_project_id=${projectId} AND tenant_id=${tenantId}`,(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}
//////
function listVisitors(tenantId,projectId,monthSelect,yearSelect){
    return new Promise((resolve,reject)=>{
        connection.query(`SELECT A.visitor_id, A.first_name, A.last_name, A.dni, DATE_FORMAT(B.date,'%d/%m/%y') AS date_format , B.time, B.temperature,  B.reason, B.observation FROM visitor A LEFT JOIN visitor_details B ON A.visitor_id=B.visitor_id WHERE B.tenant_id='${tenantId}' AND A.client_project_id =${projectId} AND YEAR(B.date)=${yearSelect} AND MONTH(B.date)=${monthSelect} AND B.is_deleted=0 `,(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}
//////
function updateProject(table, data, tenantId){
    return new Promise((resolve,reject)=>{
        connection.query(`UPDATE ${table} SET ? WHERE tenant_id='${tenantId}' AND client_project_id=${data.client_project_id}`,[data],(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}
//////
function updateVisitors(data,tenantId, projectId,visitorId){
    return new Promise((resolve,reject)=>{
        connection.query(`UPDATE visitor SET ? WHERE visitor_id=${visitorId} AND tenant_id='${tenantId}' AND client_project_id=${projectId}`,[data],(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}
//////
function updateVisitorDetails(data, tenantId,projectId,visitorId){
    return new Promise((resolve,reject)=>{
        connection.query(`UPDATE visitor_details A LEFT JOIN visitor B ON A.visitor_id=B.visitor_id SET A.visitor_detail_id=${data.visitor_detail_id}, A.visitor_id=${data.visitor_id}, A.date='${data.date}', A.time='${data.time}', A.temperature=${data.temperature}, A.reason='${data.reason}', A.observation='${data.observation}', A.is_deleted=${data.is_deleted}, A.tenant_id='${tenantId}' WHERE B.tenant_id='${tenantId}'  AND B.client_project_id=${projectId} AND B.visitor_id=${visitorId}`,(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}
//////
function updateTypeId(table, data,typeId,Id, tenantId,projectId){
    return new Promise((resolve,reject)=>{
        connection.query(`UPDATE ${table} SET ? WHERE ${typeId}=${Id} AND tenant_id='${tenantId}' AND client_project_id=${projectId}`,[data],(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}
//////
function updatePersonQuestion(tenantId,projectId,personalId,daySelect,monthSelect,yearSelect,personalQuestionId,newAnswer){
    return new Promise((resolve,reject)=>{
        connection.query(`UPDATE person_question A LEFT JOIN personal B ON A.personal_id=B.personal_id SET answer=${newAnswer} WHERE A.tenant_id='${tenantId}' AND B.client_project_id=${projectId} AND A.personal_id=${personalId} AND DAY(A.date)=${daySelect} AND MONTH(A.date)=${monthSelect} AND YEAR(A.date)=${yearSelect} AND A.personal_question_id=${personalQuestionId}`,(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}
//////
function deleteProject(tenantId,projectId){
    return new Promise((resolve,reject)=>{
        connection.query(`UPDATE project SET is_deleted=1 WHERE tenant_id='${tenantId}' AND client_project_id=${projectId}`,(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}
//////
function deleteVisitors(tenantId,projectId,visitorId){
    return new Promise((resolve,reject)=>{
        connection.query(`UPDATE visitor SET is_deleted=1 WHERE tenant_id='${tenantId}' AND client_project_id=${projectId} AND visitor_id=${visitorId}`,(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}

//////
function deleteVisitorDetails(tenantId,projectId,visitorId){
    return new Promise((resolve,reject)=>{
        connection.query(`UPDATE visitor_details A LEFT JOIN visitor B ON A.visitor_id=B.visitor_id SET A.is_deleted= 1 WHERE B.tenant_id='${tenantId}' AND B.client_project_id=${projectId} AND B.visitor_id=${visitorId}`,(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}
//////
function deleteTypeId(table, tenantId,projectId,typeId,Id){
    return new Promise((resolve,reject)=>{
        connection.query(`UPDATE ${table} SET is_deleted=1 WHERE tenant_id='${tenantId}' AND  client_project_id=${projectId} AND ${typeId}=${Id}`,(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}
//////
function deletePersonQuestion(tenantId,projectId,personalId,daySelect,monthSelect,yearSelect,personalQuestionId){
    return new Promise((resolve,reject)=>{
        connection.query(`UPDATE person_question A LEFT JOIN personal B ON A.personal_id=B.personal_id SET A.is_deleted=1 WHERE A.tenant_id='${tenantId}' AND B.client_project_id=${projectId} AND A.personal_id=${personalId} AND DAY(A.date)=${daySelect} AND MONTH(A.date)=${monthSelect} AND YEAR(A.date)=${yearSelect} AND A.personal_question_id=${personalQuestionId}`,(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}
//////
function deletedTables(table){
    return new Promise((resolve,reject)=>{
        connection.query(`DELETE  FROM ${table}`,(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}
//////
function getNameProject(table,tenantId,projectId,){
    return new Promise((resolve,reject)=>{
        connection.query(`SELECT name FROM ${table} WHERE tenant_id='${tenantId}' AND client_project_id='${projectId}' `,(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}
//////
function getProjectIdForPersonal(tenantId,personalId,){
    return new Promise((resolve,reject)=>{
        connection.query(`SELECT client_project_id FROM personal WHERE tenant_id='${tenantId}' AND personal_id='${personalId}' `,(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}
//////
function getHeaderPdfPersonal(tenantId,projectId,personalId){
    return new Promise((resolve,reject)=>{
        connection.query(`SELECT A.first_name, A.last_name, A.dni, B.name FROM personal A LEFT JOIN project B ON A.client_project_id=B.client_project_id WHERE A.tenant_id='${tenantId}' AND A.client_project_id = ${projectId} AND A.personal_id=${personalId} AND A.is_deleted=0 `,(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}
//////
function getQuestions(tenantId,projectId){
    return new Promise((resolve,reject)=>{
        connection.query(`SELECT description, question_id FROM questions WHERE tenant_id='${tenantId}' AND client_project_id = ${projectId} AND status=1`,(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}
//////
function  getDaysOfMonthForPersonal(tenantId,projectId,personalId,month,year){
    return new Promise((resolve,reject)=>{
        connection.query(`SELECT  DATE_FORMAT(A.date,'%d'), A.moment FROM person_question A LEFT JOIN personal B ON A.personal_id=B.personal_id WHERE B.tenant_id='${tenantId}'  AND B.client_project_id = ${projectId} AND B.personal_id=${personalId} AND YEAR(A.date)=${year} AND MONTH(A.date)=${month} AND A.is_deleted=0 GROUP BY A.date, A.moment;`,(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}
//////
function getAnswerPersonal(tenantId,projectId,personalId,month,year,day,moment){
    return new Promise((resolve,reject)=>{
        connection.query(`SELECT A.answer, A.question_id FROM person_question A LEFT JOIN personal B ON A.personal_id=B.personal_id WHERE B.tenant_id='${tenantId}'  AND B.client_project_id = ${projectId} AND B.personal_id=${personalId} AND YEAR(A.date)=${year} AND MONTH(A.date)=${month} AND DAY(A.date)=${day} AND A.moment=${moment} AND A.is_deleted=0 AND status=1`,(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}

//////
function upsert(table,data){
    return insert(table,data);
}
//////
function update(table,data){
    return new Promise((resolve,reject)=>{
        connection.query(`UPDATE ${table} SET ? WHERE tenant_id=?`,[data,data.tenant_id],(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}
//////
function query(table,q){
    return new Promise((resolve,reject)=>{
        connection.query(`SELECT * FROM ${table} WHERE ${table}.?`,q,(err,result)=>{
            if(err) return reject(err);
            if(result.length==0){
                resolve(null);
            }else{
                let output = {
                    id:result[0].tenant_id,
                    username:result[0].username,
                    password:result[0].password
                }
                resolve(output||null);
            }
        })
    })
}
//////
function searchUser(table,username,email){
    return new Promise((resolve,reject)=>{
        connection.query(`SELECT * FROM ${table} WHERE username=${username} OR email='${email}'`,(err,result)=>{
            if(err) return reject(err);
            if(result.length == 0 ){
                resolve(null);
            }else{
                let output = {
                    username:result[0].username,
                    email:result[0].email,
                }
                resolve(output);
            }
        })
    })
}
////
function insertCodeVerification(table,code,email){
    return new Promise((resolve,reject)=>{
        connection.query(`UPDATE ${table} SET code_verification=${code} WHERE email='${email}'`,(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}
////
function getCode(table,email){
    return new Promise((resolve,reject)=>{
        connection.query(`SELECT code_verification FROM ${table} WHERE email='${email}'`,(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}
////
function getTenantId(table){
    return new Promise((resolve,reject)=>{
        connection.query(`SELECT AUTO_INCREMENT FROM  INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'CQmHCA1iJi' AND  TABLE_NAME='${table}';`,(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}
////
function lastTenantId(){
    return new Promise((resolve,reject)=>{
        connection.query(`SELECT LAST_INSERT_ID();`,(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}
module.exports={
    insert,
    listVisitors,
    //list,
    lastTenantId,
    update,
    updateProject,
    updateTypeId,
    updateVisitors,
    updateVisitorDetails,
    updatePersonQuestion,
    deleteProject,
    deleteVisitors,
    deleteVisitorDetails,
    deleteTypeId,
    deletePersonQuestion,
    deletedTables,
    getNameProject,
    getHeaderPdfPersonal,
    getQuestions,
    getAnswerPersonal,
    getDaysOfMonthForPersonal,
    getCode,
    getProjectIdForPersonal,
    getTenantId,
    upsert,
    query,
    searchUser,
    insertCodeVerification,
    handleConnection,
}