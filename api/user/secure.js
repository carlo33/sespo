const auth = require('../../auth');
module.exports=function checkAuth(action){
    function middelware(req,res,next){
        switch(action){
            case 'update':
                const ownerId=req.body.tenantId;
                console.log('[tenantId]:',ownerId);
                auth.check.own(req,ownerId);
                next();
                break;
            default:
                next();
        }
    }
    return middelware;
}