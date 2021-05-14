const {nanoid}=require('nanoid');
const auth = require('../auth/controller');
const store = require('../MySql/mysql');
const token = require('../../auth/index');
const controllerEmail = require('../email/controller'); 
const TABLA = 'user';
////
async function upsert(body){
    const user = {
        username:body.username,
        name:body.name,
        email:body.email,
        licence_key:body.licenceKey,
        licence_type:body.licenceType,
        entity:body.entity,
        is_deleted:0,
        code_verification:0,
    }
    if(body.tenantId){
        user.tenant_id=body.tenantId;
    }else{
        user.tenant_id=nanoid();
    }
    //is user exits?
    const isUserExits = await store.searchUser(TABLA,body.username,body.email);
    if (isUserExits){
        console.log('[user exits]');
        return null;
    }else{
        console.log('[user regestered]');
        if(body.password||body.username){
        await auth.upsert({
            tenant_id:user.tenant_id,
            username:user.username,
            password:body.password,
        })
        } 
        await store.upsert(TABLA,user);
        let data = {
            id:user.tenant_id,
            username:user.username,
            password:user.password
        }
        let token = await auth.getToken(data);
        return {
            tenantId:user.tenant_id,
            token:token,
        }
    }
}
/////
async function update(body){
    const user = {
        username:body.username,
        name:body.name,
        email:body.email,
        licence_key:body.licenceKey,
        licence_type:body.licenceType,
        entity:body.entity,
        is_deleted:0,
        code_verification:0,
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
        password:body.password
    }
    const response= await store.update(TABLA,user);
    console.log(response);
    console.log(data);
    return token.sign(data);
}
////
async function getCode(body){
    let data = await store.query(TABLA,{email:body.email})
    console.log(data);
    if(data){
        //generar codigo 6 digitos
        let codeVerification = Math.floor(100000 + Math.random() * 900000);
        await store.insertCodeVerification(TABLA,codeVerification,body.email);
        return controllerEmail.sendCode(body.email,codeVerification);
        //return 
    } else{
        return null;
    }
}
async function setNewPassword(body){
    let [{code_verification:code}] = await store.getCode(TABLA,body.email);
    console.log(code);
    if(body.code==code){
        let data = await store.query(TABLA,{email:body.email})
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