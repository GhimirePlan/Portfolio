export function contactConfig() {
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER?.trim() || process.env.EMAIL_ADDRESS?.trim();
  const pass = process.env.SMTP_PASS || process.env.GMAIL_PASSKEY;
  const secret = process.env.RECAPTCHA_SECRET_KEY?.trim() || process.env.GOOGLE_RECAPTCHA_SECRET_KEY?.trim();
  const siteKey = process.env.RECAPTCHA_SITE_KEY?.trim() || process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim();
  const emailReady = Boolean(user && pass && Number.isInteger(port) && port > 0 && port < 65536);
  const captchaReady = Boolean(secret && siteKey);
  const hosts = new Set((process.env.RECAPTCHA_ALLOWED_HOSTNAMES || 'plan.com.np,www.plan.com.np').split(',').map(host => host.trim().toLowerCase()).filter(Boolean));
  for (const value of [process.env.NEXT_PUBLIC_APP_URL, process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`]) { try { hosts.add(new URL(value).hostname.toLowerCase()); } catch {} }
  if (process.env.NODE_ENV !== 'production') { hosts.add('localhost'); hosts.add('127.0.0.1'); }
  return { port, user, pass, secret, siteKey, emailReady, captchaReady, hosts, ready: emailReady && captchaReady };
}
