const nodemailer = require("nodemailer");

// Khai báo transport
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER, //gmail
    pass: process.env.MAIL_PASS, //pass
  },
});

module.exports = transporter;
