const nodemailer = require("nodemailer");

// Khai báo transport
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "", //gmail
    pass: "", //pass
  },
});

module.exports = transporter;
