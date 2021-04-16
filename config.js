module.exports={
    api:{
        port:process.env.API_PORT||3000,
    },
    mysql:{
        host: process.env.MYSQL_HOST||'remotemysql.com',
        user: process.env.MYSQL_USER||'CQmHCA1iJi',
        password: process.env.MYSQL_PASSWORD||'jO43OF4Ycc',
        database: process.env.MYSQL_DATABASE||'CQmHCA1iJi',
    }
}
