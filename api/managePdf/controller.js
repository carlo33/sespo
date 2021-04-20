const store = require('../mangeMySql/mysql');
const TABLA_PROJECT = 'project';
const TABLA_VISITORS = 'visitor';
const TABLA_VISITOR_DETAILS =  'visitor_details';


async function listVisitors(){
    return store.listAll(TABLA_VISITORS);
}
async function listVisitorDetails(body){
    return store.list(TABLA_VISITOR_DETAILS,body.month,body.year);
}
async function getNameProject(clientProjectId){
    return store.getNameProject(TABLA_PROJECT,clientProjectId);
}
module.exports ={
    listVisitors,
    listVisitorDetails,
    getNameProject,
}