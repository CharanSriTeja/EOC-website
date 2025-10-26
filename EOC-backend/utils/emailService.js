import { ApiClient, TransactionalEmailsApi } from '@getbrevo/brevo';

const defaultClient = ApiClient.instance;

const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const transactionalEmailApi = new brevo.TransactionalEmailsApi();

export const sendVerificationEmail = async (toEmail, verificationUrl) => {
  const emailContent = {
    to: [{ email: toEmail }],
    sender: { email: process.env.SENDER_EMAIL, name: "EOC Portal" },
    subject: "Verify your EOC Portal email",
    htmlContent: `
      <h2>Please verify your email</h2>
      <p>Click the link below to confirm your address:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>This link will expire in 30 mins.</p>
    `,
  };

  await transactionalEmailApi.sendTransacEmail(emailContent);
};


export const sendResetPasswordEmail = async (email, resetUrl) => {
  const emailContent = {
    to: [{ email }],
    sender: { email: process.env.SENDER_EMAIL, name: "EOC Support" },
    subject: "Reset your EOC password",
    htmlContent: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 30 minutes.</p>`,
  };

  await transactionalEmailApi.sendTransacEmail(emailContent);
};
