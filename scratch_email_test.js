require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const { Resend } = require('resend');

async function testEmail() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  console.log('RESEND_API_KEY found:', apiKey ? `${apiKey.substring(0, 10)}...` : 'MISSING');

  if (!apiKey) return;

  const resend = new Resend(apiKey);
  try {
    const res = await resend.emails.send({
      from: 'NexCart <onboarding@resend.dev>',
      to: 'delivered@resend.dev',
      subject: 'Test Reset Link',
      html: '<p>Test password reset link email</p>',
    });
    console.log('Resend response:', res);
  } catch (err) {
    console.error('Resend error:', err);
  }
}

testEmail();
