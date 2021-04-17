
const store = require('./mysql');
function writeMysql(table,data){
    return store.insert(table,data);
}


module.exports={
    writeMysql,
}