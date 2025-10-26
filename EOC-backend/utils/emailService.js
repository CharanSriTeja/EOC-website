import nodemailer from 'nodemailer';

// Create transporter using Brevo SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.BREVO_SMTP_USER || process.env.SENDER_EMAIL,
    pass: process.env.BREVO_API_KEY, // Use your Brevo SMTP key
  },
});

export const sendVerificationEmail = async (toEmail, verificationUrl) => {
  const mailOptions = {
    from: `"EOC Portal" <${process.env.SENDER_EMAIL}>`,
    to: toEmail,
    subject: 'Verify your EOC Portal Email',
    html: `
      <h2>Email Verification</h2>
      <p>Click below to verify your email:</p>
      <a href="${verificationUrl}" style="color:blue;text-decoration:underline;">Verify Email</a>
      <p>This link will expire in 30 minutes.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${toEmail}`);
  } catch (error) {
    console.error('❌ Error sending verification email:', error.message);
    throw new Error('Failed to send verification email.');
  }
};

export const sendResetPasswordEmail = async (email, resetUrl) => {
  const mailOptions = {
    from: `"EOC Support" <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: 'Reset Your EOC Password',
    html: `
      <h3>Password Reset Request</h3>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}" style="color:red;text-decoration:underline;">Reset Password</a>
      <p>This link expires in 30 minutes.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${email}`);
  } catch (error) {
    console.error('❌ Error sending reset password email:', error.message);
    throw new Error('Failed to send reset password email.');
  }
};