export const sendVerificationEmail = async (toEmail, verificationUrl) => {
  // Debug logging
  console.log('🔍 Checking environment variables:');
  console.log('BREVO_API_KEY exists:', !!process.env.BREVO_API_KEY);
  console.log('BREVO_API_KEY length:', process.env.BREVO_API_KEY?.length);
  console.log('SENDER_EMAIL:', process.env.SENDER_EMAIL);

  const emailData = {
    sender: { 
      name: "EOC Portal", 
      email: process.env.SENDER_EMAIL 
    },
    to: [{ email: toEmail }],
    subject: "Verify your EOC Portal Email",
    htmlContent: `
      <h2>Email Verification</h2>
      <p>Click below to verify your email:</p>
      <a href="${verificationUrl}" style="color:blue;text-decoration:underline;">Verify Email</a>
      <p>This link will expire in 30 minutes.</p>
    `,
  };

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Brevo API Error:', errorData);
      throw new Error(`Brevo API error: ${errorData.message || response.statusText}`);
    }

    const result = await response.json();
    console.log(`✅ Verification email sent to ${toEmail}`, result);
  } catch (error) {
    console.error('❌ Error sending verification email:', error.message);
    throw new Error('Failed to send verification email.');
  }
};

export const sendResetPasswordEmail = async (email, resetUrl) => {
  const emailData = {
    sender: { 
      name: "EOC Support", 
      email: process.env.SENDER_EMAIL 
    },
    to: [{ email }],
    subject: "Reset Your EOC Password",
    htmlContent: `
      <h3>Password Reset Request</h3>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}" style="color:red;text-decoration:underline;">Reset Password</a>
      <p>This link expires in 30 minutes.</p>
    `,
  };

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Brevo API Error:', errorData);
      throw new Error(`Brevo API error: ${errorData.message || response.statusText}`);
    }

    const result = await response.json();
    console.log(`✅ Password reset email sent to ${email}`, result);
  } catch (error) {
    console.error('❌ Error sending reset password email:', error.message);
    throw new Error('Failed to send reset password email.');
  }
};