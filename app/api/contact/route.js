import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { contactConfig } from '@/lib/contact-config';
import { saveContact, notifyContact, updateContact } from '@/lib/contact-inbox';
import { recordAnalytics } from '@/lib/analytics';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;
const reply = (code, message, status) => NextResponse.json({ success: false, code, message }, { status });
const escapeHtml = value => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));

// Site keys are public. Never return the secret key or email credentials.
export async function GET() {
  const config = contactConfig();
  return NextResponse.json({ siteKey: config.siteKey || '', ready: config.captchaReady && (config.emailReady || Boolean(process.env.MONGODB_URI)), code: !config.captchaReady ? 'CAPTCHA_NOT_CONFIGURED' : !config.emailReady && !process.env.MONGODB_URI ? 'EMAIL_NOT_CONFIGURED' : 'READY' }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return reply('INVALID_INPUT', 'Please provide a valid name, email, and message.', 400); }
  const { name, email, message, recaptchaToken } = body || {};
  if (typeof name !== 'string' || !name.trim() || name.length > 100 || typeof email !== 'string' || email.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) || typeof message !== 'string' || !message.trim() || message.length > 5000) return reply('INVALID_INPUT', 'Please provide a valid name, email, and message.', 400);
  const config = contactConfig();
  if (!config.captchaReady) return reply('CAPTCHA_NOT_CONFIGURED', 'The message form is temporarily unavailable. Please contact Plan by email.', 503);
  if (!config.emailReady && !process.env.MONGODB_URI) return reply('EMAIL_NOT_CONFIGURED', 'The message service is temporarily unavailable. Please contact Plan by email.', 503);
  if (typeof recaptchaToken !== 'string' || !recaptchaToken || recaptchaToken.length > 10000) return reply('CAPTCHA_REQUIRED', 'Please wait for verification to load and try again.', 400);
  let verification, result;
  try {
    verification = await fetch('https://www.google.com/recaptcha/api/siteverify', { method: 'POST', body: new URLSearchParams({ secret: config.secret, response: recaptchaToken }), signal: AbortSignal.timeout(10000), cache: 'no-store' });
    if (!verification.ok) throw new Error("Verification service unavailable");
    result = await verification.json();
    if (!result || typeof result !== "object") throw new Error("Invalid verification response");
  } catch { return reply('CAPTCHA_UNAVAILABLE', 'Verification could not connect. Check your connection and try again.', 503); }
  const age = result.challenge_ts ? Date.now() - Date.parse(result.challenge_ts) : Infinity;
  if (!verification.ok || !result.success || typeof result.score !== 'number' || result.score < 0.5 || result.action !== 'contact_form' || !config.hosts.has(String(result.hostname || '').toLowerCase()) || !Number.isFinite(age) || age > 120000 || age < -60000) {
    console.warn('Contact verification rejected', { codes: result['error-codes'] || [], actionMatches: result.action === 'contact_form', hostnameMatches: config.hosts.has(String(result.hostname || '').toLowerCase()) });
    return reply('CAPTCHA_REJECTED', 'Verification did not pass. Please try again; a fresh check will run.', 400);
  }
  const record = await saveContact({name:name.trim(),email:email.trim(),message:message.trim()});
  const notification = notifyContact(record);
  let delivered = false;
  if(config.emailReady){
  const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST || 'smtp.gmail.com', port: config.port, secure: config.port === 465, auth: { user: config.user, pass: config.pass }, connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000 });
  try {
    const info = await transporter.sendMail({ from: { name: 'Portfolio Contact', address: config.user }, to: process.env.CONTACT_EMAIL || 'contact@plan.com.np', replyTo: email.trim(), subject: `New Message From ${name.trim().replace(/[\r\n]/g, ' ')}`, text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`, html: `<h2>New Message Received</h2><p><strong>Name:</strong> ${escapeHtml(name.trim())}</p><p><strong>Email:</strong> ${escapeHtml(email.trim())}</p><p style="white-space:pre-wrap">${escapeHtml(message.trim())}</p>` });
    if (!info.accepted?.length || info.rejected?.length) throw new Error('Recipient not accepted');
    delivered = true;
  } catch (error) {
    console.error('Contact email delivery failed', { code: error.code || 'DELIVERY_FAILED' });
    // An inbox receipt remains successful even when SMTP is unavailable.
  } finally { transporter.close(); }
  }
  await notification;
  await updateContact(record?._id,{emailStatus:delivered?'sent':config.emailReady?'failed':'not_configured'});
  if(record||delivered){
    await recordAnalytics({ type:'contact_submission',path:'/',source:'contact-form' });
    return NextResponse.json({success:true,message:'Your message has been received successfully. Thank you!'});
  }
  return reply('DELIVERY_FAILED','Your message could not be received. Your text is still here—please retry or contact Plan by email.',502);
}
