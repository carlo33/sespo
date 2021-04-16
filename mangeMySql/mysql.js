const mysql = require('mysql');
const config = require('../config');
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
module.exports={
    insert,
}