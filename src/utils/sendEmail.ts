import * as nodemailer from 'nodemailer';

// async..await is not allowed in global scope, must use a wrapper
export const sendEmail = async (email: string, link: string) => {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'apikey', // generated ethereal user
      pass: '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', // generated ethereal password
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"BinhTV7 👻" <binhlinh473@gmail.com>', // sender address
    to: email, // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world! Please click the link to verify register!!!', // plain text body
    html: `<b>Hello world?</b> <a href="${link}">link verify</a>`, // html body
  });
  //console.log(email);
  //console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};