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
        connection.query(`SELECT *, DATE_FORMAT(date,'%d/%m/%y') AS date_format FROM ${table} WHERE MONTH(date)=${monthSelect} AND YEAR(DATE)=${yearSelect}`,(err,data)=>{
            if(err) return reject(err);
            resolve(data);
        })
    })
}
////////////////////////////////////////////////////
function deleted(table, clientProjectId,visitorId){
    return new Promise((resolve,reject)=>{
        connection.query(`UPDATE ${table} SET is_deleted=1 WHERE visitor_id=${visitorId} AND client_project_id=${clientProjectId}`,(err,data)=>{
            if(err) return reject(err);
            resolve(data);
        })
    })
}
////////////////////////////////////////////////////
function update(table, data, clientProjectId,visitorId){
    return new Promise((resolve,reject)=>{
        connection.query(`UPDATE ${table} SET ? WHERE visitor_id=${visitorId} AND client_project_id=${clientProjectId}`,[data],(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        })
    })
}
////////////////////////////////////////////////////
function listAll(table){
    return new Promise((resolve,reject)=>{
        connection.query(`SELECT * FROM ${table}`,(err,data)=>{
            if(err) return reject(err);
            resolve(data);
        })
    })
}
////////////////////////////////////////////////////
function getNameProject(table,clientProjectId){
    return new Promise((resolve,reject)=>{
        //connection.query(`SELECT * FROM ${table}`,(err,data)=>{
        connection.query(`SELECT name FROM ${table} WHERE client_project_id='${clientProjectId}'`,(err,data)=>{
            if(err) return reject(err);
            resolve(data);
        })
    })
}
////////////////////////////////////////////////////
module.exports={
    insert,
    deleted,
    update,
    list,
    listAll,
    getNameProject,
}