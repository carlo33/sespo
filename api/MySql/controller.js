const store = require('./mysql');

function writeMysql(table,data){
    return store.insert(table,data);
}

function readMysql(table){
    return store.list(table);
}
function updateMysqlProject(table,data,clientProjectId){
    return store.updateProject(table,data,clientProjectId);
}
function updateMysqlTypeId(table,data,typeId,clientProjectId,visitorId){
    return store.updateTypeId(table,data,typeId,clientProjectId,visitorId);
}
function updateMysqlPersonQuestion(table,newAnswer,clientProjectId,personId,daySelect,monthSelect,yearSelect,personalQuestionId){
    return store.updatePersonQuestion(table,newAnswer,clientProjectId,personId,daySelect,monthSelect,yearSelect,personalQuestionId);
}

function deleteMysqlProject(table,clientProjectId){
    return store.deleteProject(table,clientProjectId);
}
function deleteMysqlTypeId(table,typeId,clientProjectId,Id){
    return store.deleteTypeId(table,typeId,clientProjectId,Id);
}
function deleteMysqlPersonQuestion(table,clientProjectId,personId,daySelect,monthSelect,yearSelect,personalQuestionId){
    return store.deletePersonQuestion(table,clientProjectId,personId,daySelect,monthSelect,yearSelect,personalQuestionId);
}
function deletedTables(table){
    return store.deletedTables(table);
}
module.exports={
    writeMysql,
    readMysql,
    updateMysqlProject,
    updateMysqlTypeId,
    updateMysqlPersonQuestion,
    deleteMysqlProject,
    deleteMysqlTypeId,
    deleteMysqlPersonQuestion,
    deletedTables,
}