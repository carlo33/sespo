const bcrypt = require('bcrypt');
const auth =require('../../auth');
const TABLA= 'auth';
const store = require('../mangeMySql/mysql');

async function upsert(data){
    const authData={
        tenant_id:data.tenant_id,
    }
    if(data.username){
        authData.username=data.username;
    }
    if(data.password){
        authData.password= await bcrypt.hash(data.password,5)
    }
    return store.upsert(TABLA,authData);
}
async function update(data){
    const authData={
        tenant_id:data.tenant_id,
    }
    if(data.username){
        authData.username=data.username;
    }
    if(data.password){
        authData.password= await bcrypt.hash(data.password,5)
    }
    return store.update(TABLA,authData);
}
async function login(username,password){
    const data= await store.query(TABLA,{username:username});
    console.log('[user found]',data);
    return bcrypt.compare(password,data.password)
        .then(areEqual=>{
            console.log('[Compare result]',areEqual)
            if(areEqual===true){
                return auth.sign(data);
            }else{
                throw new Error('Information user invalided');
            }
        })
}
module.exports={
    upsert,
    login,
    update,
}