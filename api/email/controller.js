var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'construinnovaperu@gmail.com',
        pass:'gefdzabnwobnmyvu'
    }
});

function sendEmail(email,selectPdf){
    var mailOptions = {
        from:'construinnovaperu@gmail.com',
        to:`${email}`,
        subject:'Envio de pdfs',
        html:`<h1> SESPO</h1><h2> (Seguimiento a la Salud del Personal Obrero)</h2>
        <p>Buen dia, en el archivo adjunto se encuentra el pdf generado, Muchas gracias por usar nuestro servicio</p>`,
        attachments: [{
            path: `pdfs/${selectPdf}.pdf`,
        }
        ]
    };
    return new Promise((resolve,reject)=>{
        transporter.sendMail(mailOptions,(err,info)=>{
            if (err) {
                reject(err);
            }else{
                resolve('email sended');
            }
        })
    })
}
function sendCode(email,code){
    var mailOptions = {
        from:'construinnovaperu@gmail.com',
        to:`${email}`,
        subject:'Codigo de verifiacion - SESPO',
        html:`<h1> SESPO</h1><h2> (Seguimiento a la Salud del Personal Obrero)</h2>
        <p>Buen dia, este es su codigo de verificación: ${code}</p> `,
    };
    return new Promise((resolve,reject)=>{
        transporter.sendMail(mailOptions,(err,info)=>{
            if (err) {
                reject(err);
            }else{
                resolve('email sended');
            }
        })
    })
}
module.exports={
    sendEmail,
    sendCode,
}