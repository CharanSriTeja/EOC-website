const brevo = require('@getbrevo/brevo');

// Initialize the API instance
const apiInstance = new brevo.TransactionalEmailsApi();

// Configure API key authorization
apiInstance.authentications = apiInstance.authentications || {};
apiInstance.authentications['api-key'] = { apiKey: process.env.BREVO_API_KEY };

const sendVerificationEmail = async (toEmail, verificationUrl) => {
  const emailContent = {
    to: [{ email: toEmail }],
    sender: { email: process.env.SENDER_EMAIL, name: "EOC Portal" },
    subject: "Verify your EOC Portal Email",
    htmlContent: `
      <h2>Email Verification</h2>
      <p>Click below to verify your email:</p>
      <a href="${verificationUrl}" style="color:blue;text-decoration:underline;">Verify Email</a>
      <p>This link will expire in 30 minutes.</p>
    `,
  };

  try {
    await apiInstance.sendTransacEmail(emailContent);
    console.log(`✅ Verification email sent to ${toEmail}`);
  } catch (error) {
    console.error("❌ Error sending verification email:", error.message);
  }
};

const sendResetPasswordEmail = async (email, resetUrl) => {
  const emailContent = {
    to: [{ email }],
    sender: { email: process.env.SENDER_EMAIL, name: "EOC Support" },
    subject: "Reset Your EOC Password",
    htmlContent: `
      <h3>Password Reset Request</h3>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}" style="color:red;text-decoration:underline;">Reset Password</a>
      <p>This link expires in 30 minutes.</p>
    `,
  };

  try {
    await apiInstance.sendTransacEmail(emailContent);
    console.log(`✅ Password reset email sent to ${email}`);
  } catch (error) {
    console.error("❌ Error sending reset password email:", error.message);
  }
};

module.exports = {
  sendVerificationEmail,
  sendResetPasswordEmail,
};
