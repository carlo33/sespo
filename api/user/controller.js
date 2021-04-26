const {nanoid}=require('nanoid');
const auth = require('../auth/controller');
const store = require('../MySql/mysql');
const token = require('../../auth/index');
const TABLA = 'user';
async function upsert(body){
    const user = {
        user_id:body.userId,
        username:body.username,
        name:body.name,
        email:body.email,
        licence_key:body.licenceKey,
        licence_type:body.licenceType,
        entity:body.entity,
        is_deleted:0,
    }
    if(body.tenantId){
        user.tenant_id=body.tenantId;
    }else{
        user.tenant_id=nanoid();
    }
    if(body.password||body.username){
        await auth.upsert({
            tenant_id:user.tenant_id,
            username:user.username,
            password:body.password,
        })
    } 
    return store.upsert(TABLA,user)
}

async function update(body){
    const user = {
        user_id:body.userId,
        username:body.username,
        name:body.name,
        email:body.email,
        licence_key:body.licenceKey,
        licence_type:body.licenceType,
        entity:body.entity,
        is_deleted:0,
    }
    if(body.tenantId){
        user.tenant_id=body.tenantId;
    }else{
        user.tenant_id=nanoid();
    }
    if(body.password||body.username){
        await auth.update({
            tenant_id:user.tenant_id,
            username:user.username,
            password:body.password,
        })
    } 
    let data={
        id:user.tenant_id,
        username:user.username,
        password:user.password
    }
    const response= await store.update(TABLA,user);
    console.log(response);
    return token.sign(data);
}
module.exports={
    upsert,
    update,
}