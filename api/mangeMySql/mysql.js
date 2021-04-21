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
function list(table, monthSelect,yearSelect){
    return new Promise((resolve,reject)=>{
        connection.query(`SELECT *, DATE_FORMAT(date,'%d/%m/%y') AS date_format FROM ${table} WHERE MONTH(date)=${monthSelect} AND YEAR(date)=${yearSelect}`,(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}
////////////////////////////////////////////////////
function listAll(table){
    return new Promise((resolve,reject)=>{
        connection.query(`SELECT * FROM ${table}`,(err,result)=>{
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
function getNameProject(table,clientProjectId){
    return new Promise((resolve,reject)=>{
        connection.query(`SELECT name FROM ${table} WHERE client_project_id='${clientProjectId}'`,(err,result)=>{
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
    list,
    listAll,
    updateProject,
    updateTypeId,
    updatePersonQuestion,
    deleteProject,
    deleteTypeId,
    deletePersonQuestion,
    getNameProject,
    deletedTables,
}