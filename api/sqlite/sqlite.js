const sqlite3 = require('sqlite3').verbose();

function connecteSqlite(){
    return new Promise((resolve,reject)=>{
        const db= new sqlite3.Database('./uploads/db.sqlite', sqlite3.OPEN_READWRITE,(err)=>{
            if(err){
                console.log('[Sqlite-error]:');
                console.error(err.message);
                reject(err);
            }
            console.log('[Sqlite]:SQlite connected');
            resolve(db);
        });
    })
    
}
    

function readTable(query,db){
    return new Promise((resolve,reject)=>{
        db.serialize(()=>{
            db.all(query, function(err,rows){     
            if(err){
                return reject(err)
            }
            resolve(rows);
            });
        });
    })
}
module.exports = {
    readTable,
    connecteSqlite,
}