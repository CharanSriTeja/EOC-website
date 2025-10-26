import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (toEmail, verificationUrl) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true', // true for 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"EOC Portal" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: 'Verify your EOC Portal email',
    html: `
      <h2>Please verify your email</h2>
      <p>Click the link below to confirm your address:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>This link will expire in 30 mins.</p>
    `
  });
};

export const sendResetPasswordEmail = async (email, resetUrl) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true', 
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"EOC Support" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Reset your EOC password',
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 30 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

