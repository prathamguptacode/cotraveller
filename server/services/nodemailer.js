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



export function sendRequestNotification(email, requester, groupName) {
  const html = `
  <div style="font-family: Arial, sans-serif; background:#f7f9fc; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; padding:25px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
      
      <h2 style="color:#1E66C8; margin-top:0; text-align:center;">
        New Join Request 🚀
      </h2>

      <p style="font-size:16px; color:#333;">
        Hi there,
      </p>

      <p style="font-size:16px; color:#333; line-height:1.5;">
        You have a new join request for your Cotraveller <strong style="color:#1E66C8;">${groupName}</strong> group.  
        <strong style="color:#1E66C8;">${requester}</strong> has asked to join and is waiting for your approval.
      </p>

      <p style="font-size:16px; color:#333; line-height:1.5;">
        Please open your app and review the request whenever you're free.
      </p>

      <div style="text-align:center; margin-top:25px;">
        <a 
          href="https://cotraveller.app" 
          style="padding:12px 22px; background:#1E66C8; color:white; text-decoration:none; border-radius:6px; font-weight:bold;">
          Review Request
        </a>
      </div>

      <p style="font-size:14px; color:#777; margin-top:30px; text-align:center;">
        Thank you,<br/>The Cotraveller Team
      </p>

    </div>
  </div>
`;

  const text = `${requester} has requested to join your group "${groupName}".\n\nIf you didn't expect this, ignore this email.`;
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.EMAIL_ID,
      pass: env.EMAIL_PASS
    }
  });
  let mailOption = {
    from: env.EMAIL_ID,
    to: email,
    subject: 'New Join Request for Your Co traveller Group',
    text,
    html
  };
  transport.sendMail(mailOption, function (error, value) {
    if (error) console.log(error)
  })
}

export function accecptedNotification(email, requester, groupName) {
const html = `
  <div style="font-family: Arial, sans-serif; background:#f7f9fc; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; padding:25px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
      
      <h2 style="color:#1E66C8; margin-top:0; text-align:center;">
        Your Request Has Been Accepted 🎉
      </h2>

      <p style="font-size:16px; color:#333;">
        Hi ${requester},
      </p>

      <p style="font-size:16px; color:#333; line-height:1.5;">
        Great news! Your request to join the 
        <strong style="color:#1E66C8;">${groupName}</strong> group has been accepted.
      </p>

      <p style="font-size:16px; color:#333; line-height:1.5;">
        You can now connect with your cotraveller, chat, and plan your trip together.
      </p>

      <div style="text-align:center; margin-top:25px;">
        <a 
          href="https://cotraveller.app" 
          style="padding:12px 22px; background:#1E66C8; color:white; text-decoration:none; border-radius:6px; font-weight:bold;">
          Open Group
        </a>
      </div>

      <p style="font-size:14px; color:#777; margin-top:30px; text-align:center;">
        Safe travels,<br/>The Cotraveller Team
      </p>

    </div>
  </div>
`;


  const text = `Hi ${requester},\nGood news! Your request to join the group "${groupName}" has been accepted.\nYou can now view the group, chat, and plan your trip together.\n\nIf you weren't expecting this, you can ignore this email.`;

  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.EMAIL_ID,
      pass: env.EMAIL_PASS
    }
  });
  let mailOption = {
    from: env.EMAIL_ID,
    to: email,
    subject: `Your Request to Join ${groupName} Is Approved`,
    text,
    html
  };
  transport.sendMail(mailOption, function (error, value) {
    if (error) console.log(error)
  })
}
