const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');

sgMail.setApiKey(config.email.sendGridApiKey);

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (msg) => {
  await sgMail.send(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
 const sendResetPasswordEmail = async (to, code) => {
  const msg = {
    to,
    from: 'usablackhole@gmail.com',
    subject: 'Password reset email',
    text: 'Change Your Password',
    html: `Your Password reset code is ${code} `,
  };
  await sendEmail(msg);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail({ to, subject, text });
};

module.exports = {
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
};
