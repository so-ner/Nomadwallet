// lib/mail.ts
import nodemailer from 'nodemailer';

export function createMailer() {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD,
    },
  });
  return transporter;
}

export async function sendPasswordResetMail(to: string, resetUrl: string) {
  const transporter = createMailer();
  await transporter.sendMail({
    to,
    subject: '<Nomad Wallet> 비밀번호 재설정 안내',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;">
        <h2>비밀번호 재설정 요청</h2>
        <p>아래 버튼을 클릭하면 비밀번호를 새로 설정할 수 있습니다. (30분간 유효)</p>
        <p style="text-align:center;">
          <a href="${resetUrl}" 
             style="background:#007bff;color:#fff;padding:10px 20px;border-radius:5px;text-decoration:none;">
             비밀번호 재설정하기
          </a>
        </p>
        <p>본인이 요청하지 않았다면 이 메일을 무시하셔도 됩니다.</p>
      </div>
    `,
  });
}