function success(req,res,message,status){
    let codeStatus = status||200;
    let codemessage = message || '';
    res.status(codeStatus).send({
        error:false,
        status:codeStatus,
        body:codemessage,
    })
}
function error(req,res,message,status){
    let codeStatus= status||500;
    let codeMessage = message||'Internal error';
    res.status(codeStatus).send({
        error:true,
        status:codeStatus,
        body:codeMessage,
    })
}
module.exports = {
    success,
    error,
}