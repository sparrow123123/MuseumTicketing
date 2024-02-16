import User from "../../models/User.js"

import nodemailer from "nodemailer";
import qrcode from "qrcode";


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: "sanjaym984062@gmail.COM",
      pass: "jckj hoyp wchh hpjz",
    },
  });

export const sendemail = async (req,res,next) => {
    const{date,user,count,bookingId,museum,price} = req.body;
   
    let existingUser;
    try{
        existingUser= await User.findById(user);
    }catch(err){
        return console.log(err);
    }
    console.log(existingUser.name,existingUser.email);

    const qrCodeData = `Museum: ${museum}
    Tickets: ${count}
    Date: ${date}
    bookingId : ${bookingId}`;
    const qrCodeImagePath = 'qrcode.png';

    await qrcode.toFile(qrCodeImagePath, qrCodeData);

   
    const textTemplate = `
      HistoriScan Ticket Booking Confirmation

      Dear ${existingUser.name},

      Your HistoriScan tickets booking has been confirmed. Below are the details of your booking:

      Movie: ${museum}
      Date: ${date}
      TIckets: ${count}
      Total Amount: ${count*price}

      Thank you for using our HistoriScan ticket booking service. Enjoy your journey!

      This is an automated email. Please do not reply.
    `;

    var mailOptions = {
        from : "HeritageCulture@gmail.com",
        to : existingUser.email,
        subject: 'Museum Ticket Booking Confirmation',
        text: textTemplate,
        attachments: [
          {
            filename: 'qrcode.png',
            path: qrCodeImagePath,
            cid: 'unique@qrcode.com', // use a unique identifier for the CID
          },
        ],
    };
 
     transporter.sendMail(mailOptions,function(error,info){
        if(error){
            console.log(error);
        }
        else{
            console.log("Email send successfully");
        }
     })
}

