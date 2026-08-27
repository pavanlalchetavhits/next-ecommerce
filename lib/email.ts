import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY?.trim();
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  if (!resend || !resendApiKey) {
    console.warn('[EMAIL WARNING] RESEND_API_KEY is not set in environment variables. Email sending skipped.');
    console.log(`[DEVELOPMENT EMAIL FALLBACK LOG] To: ${email} | Link: ${resetUrl}`);
    return { success: false, reason: 'RESEND_API_KEY missing' };
  }

  // Resend free tier fallback sender if custom domain is unverified
  const fromEmail = process.env.EMAIL_FROM && !process.env.EMAIL_FROM.includes('yourdomain.com')
    ? process.env.EMAIL_FROM
    : 'NexCart <onboarding@resend.dev>';

  try {
    const data = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Reset Your NexCart Password',
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f5ff; border-radius: 16px;">
          <div style="background: linear-gradient(135deg, #4F46E5, #7C3AED); padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; tracking-tight: -0.5px;">NexCart</h1>
            <p style="color: #e0e7ff; margin: 6px 0 0 0; font-size: 14px; font-weight: 500;">Password Reset Security Request</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 32px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <h2 style="color: #0f172a; margin-top: 0; font-size: 20px; font-weight: 700;">Reset Your Password</h2>
            
            <p style="color: #475569; font-size: 15px; line-height: 1.6;">
              We received a request to reset the password for your account associated with <strong>${email}</strong>.
            </p>
            
            <p style="color: #475569; font-size: 15px; line-height: 1.6;">
              Click the button below to set a new password. For security purposes, this password reset link is valid for <strong>10 minutes</strong>.
            </p>
            
            <div style="margin: 32px 0; text-align: center;">
              <a
                href="${resetUrl}"
                style="
                  background: linear-gradient(135deg, #4F46E5, #6366F1);
                  color: #ffffff;
                  padding: 14px 28px;
                  border-radius: 10px;
                  display: inline-block;
                  font-weight: 700;
                  font-size: 15px;
                  text-decoration: none;
                  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
                "
              >
                Reset Password
              </a>
            </div>

            <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin-top: 24px;">
              If the button above does not work, copy and paste this URL into your browser address bar:
              <br/>
              <a href="${resetUrl}" style="color: #6366F1; word-break: break-all;">${resetUrl}</a>
            </p>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />

            <p style="color: #94a3b8; font-size: 12px; margin-bottom: 0;">
              If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
            </p>
          </div>
        </div>
      `,
    });

    console.log(`[EMAIL SUCCESS] Password reset email sent successfully to ${email}. ID: ${data?.data?.id || 'OK'}`);
    return { success: true, data };
  } catch (error: any) {
    console.error(`[EMAIL ERROR] Failed to send password reset email to ${email}:`, error);
    return { success: false, error: error.message };
  }
}