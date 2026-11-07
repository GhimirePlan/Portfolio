'use client';

import { useState } from 'react';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { BsArrowRight, BsCheckCircle } from 'react-icons/bs';
import { personalData } from '@/utils/data/personal-data';

function ContactFormContent({ executeRecaptcha }) {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  async function submit(event) {
    event.preventDefault();
    if (status === 'sending') return;
    setError('');
    if (!executeRecaptcha) { setError(`The message form is unavailable. Please email ${personalData.email}.`); return; }
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    setStatus('sending');
    try {
      const recaptchaToken = await executeRecaptcha('contact_form');
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...values, recaptchaToken }) });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || 'Your message could not be sent. Please try again.');
      setStatus('sent'); form.reset();
    } catch (error) { setError(error.message || 'Your message could not be sent. Please try again.'); setStatus('idle'); }
  }
  return <form onSubmit={submit} className="site-contact-form" aria-label="Contact form" aria-busy={status === 'sending'}>
    <div className="site-form-pair"><div><label htmlFor="contact-name">Your Name</label><input id="contact-name" name="name" autoComplete="name" required maxLength={100} /></div><div><label htmlFor="contact-email">Your Email</label><input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={100} /></div></div>
    <div><label htmlFor="contact-message">Your Message</label><textarea id="contact-message" name="message" required maxLength={5000} rows={6} /></div>
    {error && <p className="site-form-error" role="alert">{error}</p>}
    {status === 'sent' ? <p className="site-form-success" role="status"><BsCheckCircle aria-hidden="true" />Your message has been sent successfully. Thank you!</p> : <button type="submit" className="site-button" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send Message'}<BsArrowRight aria-hidden="true" /></button>}
  </form>;
}
function VerifiedContactForm() { const { executeRecaptcha } = useGoogleReCaptcha(); return <ContactFormContent executeRecaptcha={executeRecaptcha} />; }
export default function ContactForm() {
  const key = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  return key ? <GoogleReCaptchaProvider reCaptchaKey={key} scriptProps={{ async: true, defer: true, appendTo: 'head' }}><VerifiedContactForm /></GoogleReCaptchaProvider> : <ContactFormContent />;
}
