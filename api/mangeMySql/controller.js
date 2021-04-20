const store = require('./mysql');

function writeMysql(table,data){
    return store.insert(table,data);
}

function readMysql(table){
    return store.list(table);
}

function deletedMysql(table,clientProjectId,visitorId){
    return store.deleted(table,clientProjectId,visitorId);
}
function updateMysql(table,data,clientProjectId,visitorId){
    return store.update(table,data,clientProjectId,visitorId);
}
module.exports={
    writeMysql,
    readMysql,
    deletedMysql,
    updateMysql,
}