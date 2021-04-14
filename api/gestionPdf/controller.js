const store = require('../../store/dummy');
const TABLA_VISITORS = 'visitors';
const TABLA_VISITOR_DETAILS =  'visitor_details';


async function listVisitors(){
    return store.list(TABLA_VISITORS);
}
async function listVisitorDetails(){
    return store.list(TABLA_VISITOR_DETAILS)
}

module.exports ={
    listVisitors,
    listVisitorDetails,
}