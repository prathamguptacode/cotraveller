import nodemailer from 'nodemailer'
import env from '../config/env';

export const sendOtp = async (email: string, otp: number) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: env.EMAIL_ID, pass: env.EMAIL_PASS }
  });
  transporter.sendMail({
    from: `"Cotraveller" ${env.EMAIL_ID}`,
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



export function sendRequestNotification(emails: string[], requester: string, groupName: string) {
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
    from: `"Cotraveller" ${env.EMAIL_ID}`,
    to: emails,
    subject: 'New Join Request for Your Cotraveller Group',
    text,
    html
  };
  transport.sendMail(mailOption, function (error, value) {
    if (error) console.log(error)
  })
}

export function accecptedNotification(email: string, requester: string, groupName: string, groupId: string) {
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
          href="https://cotraveller.app/groups/${groupId}/chats" 
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
    from: `"Cotraveller" ${env.EMAIL_ID}`,
    to: email,
    subject: `Your Request to Join ${groupName} Is Approved`,
    text,
    html
  };
  transport.sendMail(mailOption, function (error, value) {
    if (error) console.log(error)
  })
}

export function newMemberJoinedNotification(emails: string[], newMemberName: string, groupName: string, groupId: string) {
  const html = `
  <div style="font-family: Arial, sans-serif; background:#f7f9fc; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; padding:25px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
      
      <h2 style="color:#1E66C8; margin-top:0; text-align:center;">
        A New Member Joined Your Group 👥
      </h2>

      <p style="font-size:16px; color:#333;">
        Hello,
      </p>

      <p style="font-size:16px; color:#333; line-height:1.5;">
        Great news! <strong style="color:#1E66C8;">${newMemberName}</strong> has just joined your 
        <strong style="color:#1E66C8;">${groupName}</strong> group.
      </p>

      <p style="font-size:16px; color:#333; line-height:1.5;">
        You can now begin planning your journey together, share tips, chat, and coordinate plans with the new member.
      </p>

      <div style="text-align:center; margin-top:25px;">
        <a 
          href="https://cotraveller.app/groups/${groupId}/chats" 
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

  const text = `Great news!\n\n${newMemberName} has joined your "${groupName}" group.\nYou can now chat and plan your trip together.\n\nSafe travels,\nThe Cotraveller Team`;

  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.EMAIL_ID,
      pass: env.EMAIL_PASS
    }
  });

  let mailOption = {
    from: `"Cotraveller" ${env.EMAIL_ID}`,
    to: emails,
    subject: `A New Member Joined ${groupName}`,
    text,
    html
  };

  transport.sendMail(mailOption, function (error, value) {
    if (error) console.log(error);
  });
}


export function rejectedNotification(email: string, requester: string, groupName: string) {
  const html = `
  <div style="font-family: Arial, sans-serif; background:#f7f9fc; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; padding:25px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
      
      <h2 style="color:#D64545; margin-top:0; text-align:center;">
        Your Request Was Declined ❗
      </h2>

      <p style="font-size:16px; color:#333;">
        Hi ${requester},
      </p>

      <p style="font-size:16px; color:#333; line-height:1.5;">
        Unfortunately, your request to join the 
        <strong style="color:#1E66C8;">${groupName}</strong> group was not approved.
      </p>

      <p style="font-size:16px; color:#333; line-height:1.5;">
        Don't worry — you can always explore other cotravellers or create your own group to start a journey.
      </p>

      <div style="text-align:center; margin-top:25px;">
        <a 
          href="https://cotraveller.app" 
          style="padding:12px 22px; background:#1E66C8; color:white; text-decoration:none; border-radius:6px; font-weight:bold;">
          Explore Groups
        </a>
      </div>

      <p style="font-size:14px; color:#777; margin-top:30px; text-align:center;">
        Safe travels,<br/>The Cotraveller Team
      </p>

    </div>
  </div>
  `;

  const text = `Hi ${requester},\n\nYour request to join the group "${groupName}" was not approved.\nYou can explore other groups or create your own on Cotraveller.\n\nSafe travels,\nThe Cotraveller Team`;

  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.EMAIL_ID,
      pass: env.EMAIL_PASS
    }
  });

  let mailOption = {
    from: `"Cotraveller" ${env.EMAIL_ID}`,
    to: email,
    subject: `Your Request to Join ${groupName} Was Declined`,
    text,
    html
  };

  transport.sendMail(mailOption, function (error, value) {
    if (error) console.log(error, value)
  });
}

export function memberLeftNotification(emails: string[], memberName: string, groupName: string, groupId: string) {
  const html = `
  <div style="font-family: Arial, sans-serif; background:#f7f9fc; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; padding:25px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
      
      <h2 style="color:#D64545; margin-top:0; text-align:center;">
        A Member Has Left Your Group 👋
      </h2>

      <p style="font-size:16px; color:#333;">
        Hello,
      </p>

      <p style="font-size:16px; color:#333; line-height:1.5;">
        <strong style="color:#1E66C8;">${memberName}</strong> has left your
        <strong style="color:#1E66C8;">${groupName}</strong> group.
      </p>

      <p style="font-size:16px; color:#333; line-height:1.5;">
        Your group is still active, and you can continue planning and coordinating with the remaining members.
      </p>

      <div style="text-align:center; margin-top:25px;">
        <a 
          href="https://cotraveller.app/groups/${groupId}/chats" 
          style="padding:12px 22px; background:#1E66C8; color:white; text-decoration:none; border-radius:6px; font-weight:bold;">
          View Group
        </a>
      </div>

      <p style="font-size:14px; color:#777; margin-top:30px; text-align:center;">
        Safe travels,<br/>The Cotraveller Team
      </p>

    </div>
  </div>
  `;

  const text = `Hello,\n\n${memberName} has left your "${groupName}" group.\nYou can continue planning your trip with the remaining members.\n\nSafe travels,\nThe Cotraveller Team`;

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.EMAIL_ID,
      pass: env.EMAIL_PASS,
    },
  });

  let mailOption = {
    from: `"Cotraveller" ${env.EMAIL_ID}`,
    to: emails,
    subject: `${memberName} Left the group ${groupName}`,
    text,
    html,
  };

  transport.sendMail(mailOption, function (error) {
    if (error) console.log(error);
  });
}
