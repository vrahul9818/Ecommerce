const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service:process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_MAIL, // Corrected: process.env.SMTP_MAIL
      pass: process.env.SMTP_PASSWORD, // Corrected: process.env.SMTP_PASSWORD
    },
  });

  const mailOptions = {
    from: process.env.SMTP_MAIL ,
    to: options.email, // Recipient's email address
    subject: options.subject, // Email subject
    text: options.message, // Email body
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
