import nodemailer from 'nodemailer'
import env from '../config/env.js';

export const sendOtp = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: env.EMAIL_ID, pass: env.EMAIL_PASS }
  });
  transporter.sendMail({
    from: `"Cotraveller" <${env.EMAIL_ID}>`,
    to: email,
    subject: `OTP:${otp}`,
    text: `Your verificaton code is ${otp}`,
    html: `<div style="font-family: Arial, sans-serif; font-size: 15px; color: #222;">
  <p>Hi,</p>

  <p>Your verification code is:</p>

  <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px;">
    ${otp}
  </p>

  <p>This code will expire in 5 minutes.</p>

  <p>If you did not request this code, you can safely ignore this email.</p>

  <br/>

  <p>Thanks,<br/>The Cotraveller Team</p>
</div>
`
  })
}
