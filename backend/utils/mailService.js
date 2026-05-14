const nodemailer = require('nodemailer');

const sendShareEmail = async (toEmail, fileName, fileUrl, ownerName, fileId) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2'
      },
      requireTLS: true,
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      debug: true, // Enable debug logs to see the handshake
      logger: true
    });

    const mailOptions = {
      from: `"Shnoor Cloud" <${process.env.SMTP_USER || 'no-reply@shnoor.cloud'}>`,
      to: toEmail,
      subject: `${ownerName} shared a file with you: ${fileName}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
          <h2 style="color: #4f46e5;">File Shared with You</h2>
          <p>Hi there,</p>
          <p><strong>${ownerName}</strong> has shared a file with you on Shnoor Cloud.</p>
          <div style="margin: 20px 0; padding: 15px; background-color: #f9fafb; border-radius: 8px;">
            <p style="margin: 0; font-weight: bold;">${fileName}</p>
          </div>
          <a href="${(process.env.CLIENT_URL || 'https://shnoor-cloud.onrender.com').replace(/\/$/, '')}/preview/${fileId}" style="display: inline-block; padding: 10px 20px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">View File</a>
          <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">If you don't have an account, please sign up to view the file.</p>
        </div>
      `,
    };

    console.log(`Attempting to send email to ${toEmail} for file "${fileName}"...`);
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${toEmail}`);
  } catch (error) {
    console.error('❌ Email sending failed. Error details:', error.message);
    if (error.code === 'EAUTH') {
      console.error('Authentication failed. Please check SMTP_USER and SMTP_PASS (App Password).');
    }
  }
};

module.exports = { sendShareEmail };
