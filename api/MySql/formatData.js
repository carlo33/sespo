const config = require('../../config');
function formatData(table,predata){
    let data ={};
    switch (table){
        case 'project':
            data = formatDataProyect(predata);
            break;
        case 'visitor':
            data = formatDataVisitor(predata);
            break;
        case 'visitor_details':
            data = formatDataVisitorDetails(predata);
            break;
        case 'questions':
            data = formatDataQuestions(predata);
            break;
        case 'personal':
            data = formatDataPersonal(predata);
            break;
        case 'person_question':
            data = formatDataPersonQuestion(predata);
            break;
        default:
            throw new Error('Data format do not find');
    }
    return data;
}
function formatDataProyect(predata){
    let data = {};
    let created_at=formatDate(predata.created_at);
    data={
        client_project_id:predata.mobile_project_id,
        type:predata.type,
        name:predata.name,
        resident:predata.resident,
        inspector:predata.inspector,
        sst_responsible:predata.sst_responsible,
        health_personal:predata.health_personal,
        status:predata.status,
        times_day:predata.times_day,
        created_at:created_at,
        is_deleted:0,
        tenant_id:predata.tenant_id,
    }
    return data;
}
////////////////////////////////////
function formatDataVisitor(predata){
    let data = {};
    data={
        visitor_id:predata.mobile_visitor_id,
        dni:predata.dni,
        first_name:predata.first_name,
        last_name:predata.last_name,
        is_deleted:0,
        tenant_id:predata.tenant_id,
        client_project_id:predata.project_id,
    }
    return data;
}
////////////////////////////////////
function formatDataVisitorDetails(predata){
    let data = {};
    let date=formatDate(predata.date);
    let time=formatTime(predata.date);
    data={
        visitor_detail_id:predata.mobile_visitor_detail_id,
        visitor_id:predata.visitor_id,
        date:date,
        time:time,
        temperature:predata.temperature,
        reason:predata.reason,
        observation:predata.observation,
        is_deleted:0,
        tenant_id:predata.tenant_id,
    }
    return data;
}
////////////////////////////////////
function formatDataQuestions(predata){
    let data = {};
    data={
        question_id:predata.mobile_question_id,
        description:predata.description,
        status:predata.status,
        type:predata.type,
        is_deleted:0,
        tenant_id:predata.tenant_id,
        client_project_id:predata.project_id,
    }
    return data;
}
////////////////////////////////////
function formatDataPersonal(predata){
    let data = {};
    data={
        personal_id:predata.mobile_personal_id,
        dni:predata.dni,
        first_name:predata.first_name,
        last_name:predata.last_name,
        age:predata.age,
        phone:predata.phone,
        address:predata.address,
        is_deleted:0,
        tenant_id:predata.tenant_id,
        client_project_id:predata.project_id,
    }
    return data;
}
////////////////////////////////////
function formatDataPersonQuestion(predata){
    let data = {};
    let date=formatDate(predata.date);
    data={
        personal_question_id:predata.mobile_personal_question_id,
        date:date,
        answer:predata.answer,
        moment:predata.moment,
        type:predata.type,
        is_deleted:0,
        personal_id:predata.personal_id,
        question_id:predata.question_id,
        tenant_id:predata.tenant_id,
        status:predata.status,
    }
    return data;
}

////////////////////////////////////
function formatDate(indexPie){
    let date = new Date(indexPie);
    let year = date.getUTCFullYear();
    let month = date.getUTCMonth() + 1;
    let day = date.getUTCDate();
    return (year + '-' + month + '-' + day);
}
////////////////////////////////////
function formatTime(indexPie){
    let time = new Date(indexPie);
    let hours =time.getHours();
    let minutes = '0'+time.getMinutes();
    let seconds = '0'+time.getSeconds();
    return (hours+':'+minutes.substr(-2)+':'+seconds.substr(-2)); 
}
module.exports={
    formatData,
}