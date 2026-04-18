
import nodemailer from "nodemailer";

const SMTPTransportOptions = {
  "host": "smtp.forwardemail.net",
  "port": "465",
  "secure": true,
  "auth": {
    "user": process.env.FW_USER,
    "pass": process.env.FW_PASS
  }
};
const transporter = nodemailer.createTransport({ ...SMTPTransportOptions });

/**
 * 
 * @param {string} email
 * @param {string} subject
 * @param {string} text
 * @param {string} html
 * @returns {Promise<string | boolean>}
 */
export async function sendEmail(email, subject, text, html) {
  try {
    const info = await transporter.sendMail({
      from: '"Happy-Tails" <info@happy-tails.xyz>',
      to: email,
      subject: subject,
      text: text,
      html: html
    });

    // console.log("Message sent: %s", info.messageId);
    return info.messageId ? info.messageId : false;
  } 
  catch (e) {
    console.error(e);
    return false;
  };
};
