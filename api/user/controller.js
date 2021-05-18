//const {nanoid}=require('nanoid');
const auth = require('../auth/controller');
const store = require('../MySql/mysql');
const token = require('../../auth/index');
const controllerEmail = require('../email/controller'); 
const TABLE = 'user';
////
async function upsert(body){
    
    const isUserExits = await store.searchUser(TABLE,body.username,body.email);
    if (isUserExits){
        console.log('[user exits]');
        return null;
    }else{
        const user = {
            username:body.username,
            name:body.name,
            email:body.email,
            licence_key:body.licence_key,
            licence_type:body.licence_type,
            entity:body.entity,
            is_deleted:0,
            code_verification:0,
        }
        await store.upsert(TABLE,user);
        console.log('[user regestered]');
        let [{'LAST_INSERT_ID()': tenantId}]= await store.lastTenantId();
        console.log('[tenantId]',tenantId);
        await auth.upsert({
            tenant_id:tenantId,
            username:user.username,
            password:body.password,
        })
        let data = {
            id:tenantId,
            username:user.username,
            password:user.password
        }
        let token = await auth.getToken(data);
        return {
            tenant_id:tenantId,
            token:token,
        }
    }
}
/////
async function update(body){
    const user = {
        tenant_id:body.tenant_id,
        username:body.username,
        name:body.name,
        email:body.email,
        licence_key:body.licence_key,
        licence_type:body.licence_type,
        entity:body.entity,
        is_deleted:0,
        code_verification:0,
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
        password:body.password
    }
    await store.update(TABLE,user);
    return token.sign(data);
}
////
async function getCode(body){
    let data = await store.query(TABLE,{email:body.email})
    console.log(data);
    if(data){
        //generar codigo 6 digitos
        let codeVerification = Math.floor(100000 + Math.random() * 900000);
        await store.insertCodeVerification(TABLE,codeVerification,body.email);
        return controllerEmail.sendCode(body.email,codeVerification);
        //return 
    } else{
        return null;
    }
}
async function setNewPassword(body){
    let [{code_verification:code}] = await store.getCode(TABLE,body.email);
    console.log(code);
    if(body.code==code){
        let data = await store.query(TABLE,{email:body.email})
        let user ={
            tenant_id:data.id,
            username:data.username,
            password:body.password
        }
        //data.password=body.password;
        console.log(user);
        return auth.update(user);
    }else{
        return null;
    }
}
module.exports={
    upsert,
    update,
    getCode,
    setNewPassword,
}