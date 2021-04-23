const store = require('../mangeMySql/mysql');
const TABLA_PROJECT = 'project';
const TABLA_VISITORS = 'visitor';
const TABLA_VISITOR_DETAILS =  'visitor_details';


async function listVisitors(body){
    return store.listVisitors(body.tenantId,body.projectId,body.month,body.year);
}
async function listVisitorDetails(body){
    return store.list(TABLA_VISITOR_DETAILS,body.tenantId,body.projectId,body.month,body.year);
}
async function getNameProject(body){
    return store.getNameProject(TABLA_PROJECT,body.tenantId,body.projectId);
}
async function getHeaderPdfPersonal(body){
    return store.getHeaderPdfPersonal(body.tenantId,body.projectId,body.personalId);
}
async function getQuestions(body){
    return store.getQuestions(body.tenantId,body.projectId);
}
async function getAnswerPersonal(body,day,moment){
    return store.getAnswerPersonal(body.tenantId,body.projectId,body.personalId,body.month,body.year,day,moment);
}

async function getDaysOfMonthForPeronal(body){
    return store.getDaysOfMonthForPeronal(body.tenantId,body.projectId,body.personalId,body.month,body.year)
}
module.exports ={
    listVisitors,
    listVisitorDetails,
    getNameProject,
    getHeaderPdfPersonal,
    getQuestions,
    getAnswerPersonal,
    getDaysOfMonthForPeronal,
}