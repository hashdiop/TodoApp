const nodemailer = require('nodemailer');

// Check if email is configured
const isEmailConfigured = () => {
  return process.env.EMAIL_HOST && 
         process.env.EMAIL_USER && 
         process.env.EMAIL_PASS &&
         process.env.FRONTEND_URL;
};

// Create transporter
const createTransporter = () => {
  if (!isEmailConfigured()) {
    throw new Error('Email configuration is missing. Please check your .env file.');
  }

  const config = {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  };

  // For Gmail, add tls
  if (process.env.EMAIL_HOST.includes('gmail')) {
    config.tls = {
      rejectUnauthorized: false
    };
  }

  return nodemailer.createTransport(config);
};

// Verify transporter connection
const verifyTransporter = async (transporter) => {
  try {
    await transporter.verify();
    console.log('✅ Email server is ready to send messages');
    return true;
  } catch (error) {
    console.error('❌ Email server verification failed:', error.message);
    return false;
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetUrl) => {
  // Development mode: log the reset URL instead of sending email
  if (process.env.NODE_ENV === 'development' && !isEmailConfigured()) {
    console.log('\n📧 ===== PASSWORD RESET (DEVELOPMENT MODE) =====');
    console.log(`Email: ${email}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log('===============================================\n');
    return;
  }

  try {
    if (!isEmailConfigured()) {
      throw new Error('Email configuration is missing. Please configure EMAIL_HOST, EMAIL_USER, EMAIL_PASS, and FRONTEND_URL in your .env file.');
    }

    const transporter = createTransporter();
    
    // Verify connection (optional, can be removed in production for performance)
    if (process.env.NODE_ENV === 'development') {
      const isVerified = await verifyTransporter(transporter);
      if (!isVerified) {
        throw new Error('Email server verification failed. Please check your email configuration.');
      }
    }

    const mailOptions = {
      from: `"TodoApp" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request - TodoApp',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>You requested to reset your password for your TodoApp account.</p>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
            Reset Password
          </a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">TodoApp Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${email}`);
  } catch (error) {
    console.error('❌ Error sending password reset email:', error.message);
    console.error('Full error:', error);
    throw error;
  }
};

module.exports = {
  sendPasswordResetEmail
};
