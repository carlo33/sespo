var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'soporteconstrutecperu@gmail.com',
        pass:'rehuacpwzabncazv'
    }
});

function sendEmail(email,selectPdf){
    var mailOptions = {
        from:'soporteconstrutecperu@gmail.com',
        to:`${email}`,
        subject:'Envio de pdfs',
        attachments: [{
            filename: 'icon-worker-100.png',
            path: '../../images/icon-worker-100.png',
            cid: 'logo'
        }],
        html:
        `
        <head>
            <style type="text/css">
            .header { 
                color:#d25041; 
                background-color: aliceblue;
                font-family: Verdana; 
                display: flex;
                justify-content: center;
                }
            .header-tittle{
                margin-left:20px;
            }
            .header-tittle p {
                justify-content: center;
            }
            .header-img{
                margin:auto 5px;
            }
            </style>
        </head>
        <div class="header">
            <div class="header-img">
                <img width='50px' height="50px" src="cid:logo">
            </div>
            <div class="header-tittle">
                <p> SESPO<br>
                (Seguimiento a la Salud del Personal Obrero)</p>
            </div>
        </div>
        <div>
            <p>Buen dia, le escribimos de constructec peru, en el archivo adjunto usted encontrará  el pdf generado por el aplicativo movil SESPO,<br> Muchas gracias por usar nuestro servicio<br><br>Atentamente 
            <br> Constructec Peru 
            <br><a href="http://construtecperu.com">www.construtecperu.com</a> </p>
        </div>
        `,
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
        from:'oporteconstrutecperu@gmail.com',
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
                resolve('code sended');
            }
        })
    })
}
module.exports={
    sendEmail,
    sendCode,
}