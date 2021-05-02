const jwt = require('jsonwebtoken');
const config = require('../config');
const error = require('../utils/error'); 
const secret = config.jwt.secret;
////
function sign(data){
    return jwt.sign(data,secret);
}
////
function verify(token){
    return jwt.verify(token,secret);
}
////
const check={
    own:function(req,ownerId){
        const decoded = decodeHeader(req);
        console.log('[User decoded]',decoded);
        if(decoded.id!==ownerId){
            throw error(`You can't update this information`,403);
        }
        console.log('[Message]: You are the  user');
    }
}
////
function getToken(auth){
    if (!auth){
        throw error('No viene token',401);
    }
    if(auth.indexOf('Bearer ')===-1){//no encuentre el bearer en el token retorna -1
        throw error('Formato invalido',401);
    }
    let token = auth.replace('Bearer ','');
    return token
}
////
function decodeHeader(req){
    const authorization = req.headers.authorization||'';
    const token = getToken(authorization);
    const decoded=verify(token);
    req.user=decoded;//----
    return decoded;
}
module.exports={
    sign,
    check,
}