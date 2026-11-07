'use client';
import { useEffect, useRef, useState } from 'react';
import { signIn, getSession, signOut } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiArrowUpRight, FiArrowRight, FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiFileText, FiMessageSquare, FiGrid } from 'react-icons/fi';

export default function LoginPage() {
  const router = useRouter(); const params = useSearchParams();
  const requested = params.get('callbackUrl');
  const callback = requested === '/admin' || (requested?.startsWith('/admin/') && !requested.startsWith('/admin/login') && !requested.includes('\\')) ? requested : '/admin';
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false); const [capsLock, setCapsLock] = useState(false);
  const [error, setError] = useState(''); const [loading, setLoading] = useState(false); const submitting = useRef(false);
  useEffect(() => { if (params.get('error')) setError(params.get('error') === 'AccessDenied' ? 'Please use an account with administrator access.' : 'We couldn’t sign you in. Check your details and try again.'); }, [params]);
  async function submit(event) {
    event.preventDefault(); if (submitting.current) return;
    submitting.current = true; setLoading(true); setError('');
    try {
      const result = await signIn('credentials', { redirect: false, email: email.trim(), password });
      if (!result?.ok || result.error) { setError('The email or password is incorrect. Please try again.'); return; }
      const session = await getSession();
      if (session?.user?.role !== 'admin') { await signOut({ redirect: false }); setError('This account doesn’t have administrator access.'); return; }
      router.replace(callback); router.refresh();
    } catch { setError('Unable to connect. Please check your connection and try again.'); }
    finally { submitting.current = false; setLoading(false); }
  }
  return <main className="portal-login">
    <section className="portal-login-story" aria-label="Your portfolio workspace">
      <Link href="/" className="portal-brand"><span className="portal-monogram">pg<span><FiArrowUpRight /></span></span><span>Plan Ghimire<small>THE WORKSPACE</small></span></Link>
      <div className="portal-login-intro"><p className="portal-eyebrow"><span />A LITTLE SPACE FOR BIG IDEAS</p><h1>Your work.<br />Beautifully<br /><em>managed.</em></h1><p>One thoughtful space for your stories,<br className="portal-desktop-break" /> conversations, and everything in between.</p></div>
      <div className="portal-login-art" aria-hidden="true"><div className="portal-art-orbit orbit-one" /><div className="portal-art-orbit orbit-two" /><span className="portal-art-star">✧</span><div className="portal-art-card art-card-back"><FiGrid /><span>Your portfolio,<br />in perspective.</span></div><div className="portal-art-card art-card-front"><span className="portal-art-card-label"><span />READY WHEN YOU ARE</span><span className="portal-art-line long" /><span className="portal-art-line" /><div><span><FiFileText /> Stories</span><span><FiMessageSquare /> Conversations</span></div><span className="portal-art-arrow"><FiArrowUpRight /></span></div></div>
      <div className="portal-login-story-footer"><span>Thoughtfully built. Personally yours.</span><span>✧</span></div>
    </section>
    <section className="portal-login-form-side">
      <Link href="/" className="portal-login-back"><FiArrowLeft /> Back to portfolio</Link>
      <div className="portal-login-form-wrap"><span className="portal-login-badge"><FiLock /> ADMIN ACCESS</span><h2>Welcome back<span>.</span></h2><p className="portal-login-subtitle">A fresh start for your next great idea.<br />Sign in to your workspace.</p>
        <form onSubmit={submit} className="portal-login-form" aria-busy={loading}>
          {error && <div role="alert" className="portal-error"><FiAlertCircle /><p>{error}</p></div>}
          <div><label htmlFor="admin-email">Email address</label><div className="portal-input-wrap"><FiMail /><input id="admin-email" name="email" type="email" autoComplete="username" placeholder="you@example.com" required maxLength={254} value={email} onChange={event => setEmail(event.target.value)} /></div></div>
          <div><label htmlFor="admin-password">Password</label><div className="portal-input-wrap"><FiLock /><input id="admin-password" name="password" type={visible ? 'text' : 'password'} autoComplete="current-password" placeholder="Enter your password" required value={password} onChange={event => setPassword(event.target.value)} onKeyUp={event => setCapsLock(event.getModifierState('CapsLock'))} onBlur={() => setCapsLock(false)} /><button type="button" className="portal-password-toggle" aria-label={visible ? 'Hide password' : 'Show password'} aria-pressed={visible} onClick={() => setVisible(value => !value)}>{visible ? <FiEyeOff /> : <FiEye />}</button></div>{capsLock && <p className="portal-caps-warning" role="status">Caps Lock is on.</p>}</div>
          <button type="submit" className="portal-button portal-button-primary portal-login-submit" disabled={loading}>{loading ? <><span className="portal-spinner" /> Signing in…</> : <>Sign in to workspace <FiArrowRight /></>}</button>
        </form>
        <p className="portal-login-help">Need access? <a href="mailto:contact@plan.com.np">Get in touch <FiArrowUpRight /></a></p>
      </div><footer className="portal-login-footer"><span>© {new Date().getFullYear()} Plan Ghimire</span><span>Your space. Your pace.</span></footer>
    </section>
  </main>;
}
