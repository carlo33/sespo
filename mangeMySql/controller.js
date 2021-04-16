const {nanoid} = require('nanoid');
const store = require('./mysql');
function writeProject(table,predata){
    let data = {};
    let client_project_id=nanoid();
    let created_at=formatDate(predata.created_at);
    data={
        client_project_id:client_project_id,
        mobile_project_id:predata.mobile_project_id,
        type:predata.type,
        name:predata.name,
        resident:predata.resident,
        inspector:predata.inspector,
        sst_responsible:predata.sst_responsible,
        health_personal:predata.health_personal,
        status:predata.status,
        times_day:predata.times_day,
        created_at:created_at,
        is_deleted:1,
        tenant_id:predata.tenant_id,
    }

    return store.insert(table,data);
}

function formatDate(indexPie){
    let date = new Date(indexPie);
    let year = date.getUTCFullYear();
    let month = date.getUTCMonth() + 1;
    let day = date.getUTCDate();
    return (year + "-" + month + "-" + day);
}
module.exports={
    writeProject,
}