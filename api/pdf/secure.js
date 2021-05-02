const auth = require('../../auth');
const controllerSqlite = require('../sqlite/controller');
module.exports=function checkAuth(action){
    async function middelware(req,res,next){
        switch(action){
            case 'synchronize':
                await controllerSqlite.readTenantId()
                    .then((payload)=>{
                        let ownerId=payload.tenant_id;
                        console.log('[secure - tenant_id - BD]', ownerId );
                        auth.check.own(req,ownerId);
                        next();
                    })
                    .catch((err)=>{
                        console.log(err);
                        return err;
                    })
                break;
            default:
                next();
        }
    }
    return middelware;
}