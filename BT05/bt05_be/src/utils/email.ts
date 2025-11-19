import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendResetPasswordEmail = async (
  email: string,
  resetLink: string,
  userName: string
): Promise<void> => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || "noreply@mernauth.com",
    to: email,
    subject: "Password Reset Request",
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p style="color: #666; font-size: 14px;">Hi ${userName},</p>
          <p style="color: #666; font-size: 14px;">
            You requested to reset your password. Click the button below to proceed:
          </p>
          <a href="${resetLink}" style="
            display: inline-block;
            background-color: #1890ff;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 4px;
            margin: 20px 0;
            font-weight: bold;
          ">Reset Password</a>
          <p style="color: #999; font-size: 12px;">
            This link will expire in 1 hour. If you didn't request this, please ignore this email.
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            Best regards,<br/>
            MERN Auth Team
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendWelcomeEmail = async (
  email: string,
  userName: string
): Promise<void> => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || "noreply@mernauth.com",
    to: email,
    subject: "Welcome to MERN Auth System",
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
          <h2 style="color: #333;">Welcome ${userName}!</h2>
          <p style="color: #666; font-size: 14px;">
            Your account has been successfully created.
          </p>
          <p style="color: #666; font-size: 14px;">
            You can now log in to your account and start using our platform.
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            Best regards,<br/>
            MERN Auth Team
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
