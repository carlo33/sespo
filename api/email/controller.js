var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'construinnovaperu@gmail.com',
        pass:'gefdzabnwobnmyvu'
    }
});

var mailOptions={
    from:'construinnovaperu@gmail.com',
    to:'cyaco33@gmail.com',
    subject:'Envio de pdfs',
    //text:'Le acavamos de enviar su pdf generado',
    html:'<h1> SESPO</h1><p> that was easy!</p>',
    attachments: [{
        path: 'pdfs/Visitors.pdf',
    }
    ]
};

function sendEmail(body){
    return new Promise((resolve,reject)=>{
        transporter.sendMail(mailOptions,(err,info)=>{
            if (err) {
                reject(err);
            }else{
                resolve(true);
            }
        })
    })
}
module.exports={
    sendEmail,
}