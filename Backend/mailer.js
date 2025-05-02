
const nodemailer = require('nodemailer')


 async function sendEmail(userdetails){
  
   
        try{
        var transport = nodemailer.createTransport({
          host: "sandbox.smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: "18a14672f457c2",
            pass: "6fd3652a2530de"
          }
        });

          const mailOptions={
            from: 'neerajkumarburnwal.cse2021@nsec.ac.in', 
            to: userdetails.customerPhoneNumber, 
            subject: "MG Shoppers",
            html: `thank you for youe shopping for queries give your bill id only which is ${userdetails._id}`, 
          }
          const mailResponse = await transport.sendMail(mailOptions)
          return mailResponse;
    } catch (error) {
        throw error;
    }

}
module.exports =sendEmail