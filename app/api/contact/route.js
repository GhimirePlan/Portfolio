import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const escapeHtml = (value) => value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, message, recaptchaToken } = body;
    if (typeof name !== 'string' || !name.trim() || name.length > 100 || typeof email !== 'string' || email.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof message !== 'string' || !message.trim() || message.length > 5000) {
      return NextResponse.json({ success: false, message: 'Please provide a valid name, email, and message.' }, { status: 400 });
    }
    if (typeof recaptchaToken !== 'string' || !recaptchaToken) return NextResponse.json({ success: false, message: 'reCAPTCHA verification is required.' }, { status: 400 });
    const user = process.env.SMTP_USER || process.env.EMAIL_ADDRESS;
    const pass = process.env.SMTP_PASS || process.env.GMAIL_PASSKEY;
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    if (!user || !pass || !secret) return NextResponse.json({ success: false, message: 'The message service is unavailable. Please contact me by email.' }, { status: 503 });
    const verification = await fetch('https://www.google.com/recaptcha/api/siteverify', { method: 'POST', body: new URLSearchParams({ secret, response: recaptchaToken }), signal: AbortSignal.timeout(10000) });
    const result = await verification.json();
    if (!verification.ok || !result.success || typeof result.score !== 'number' || result.score < 0.5 || result.action !== 'contact_form') return NextResponse.json({ success: false, message: 'reCAPTCHA verification failed. Please try again.' }, { status: 400 });
    const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST || 'smtp.gmail.com', port: Number(process.env.SMTP_PORT || 587), secure: process.env.SMTP_PORT === '465', auth: { user, pass }, connectionTimeout: 10000 });
    await transporter.sendMail({ from: user, to: process.env.CONTACT_EMAIL || 'contact@plan.com.np', replyTo: email, subject: `New Message From ${name.replace(/[\r\n]/g, ' ')}`, text: `Name: ${name}\nEmail: ${email}\n\n${message}`, html: `<h2>New Message Received</h2><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>` });
    return NextResponse.json({ success: true, message: 'Your message has been sent successfully!' });
  } catch { return NextResponse.json({ success: false, message: 'Your message could not be sent. Please try again later.' }, { status: 500 }); }
}
