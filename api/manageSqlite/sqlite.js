const sqlite3 = require('sqlite3').verbose();

const db= new sqlite3.Database('./data/db.sqlite', sqlite3.OPEN_READWRITE,(err)=>{
    if(err){
        console.log('[error]');
        console.error(err.message);
    }
    console.log('Conectado con Base de datos SQlite');
});

function readTable(query){
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
}