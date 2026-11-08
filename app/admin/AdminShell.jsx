'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { FiGrid, FiFileText, FiPlus, FiMessageSquare, FiLinkedin, FiLogOut, FiMenu, FiX, FiArrowUpRight, FiChevronRight } from 'react-icons/fi';
import './admin.css';

const navigation = [
  { name: 'Overview', href: '/admin', icon: FiGrid },
  { name: 'Blog posts', href: '/admin/posts', icon: FiFileText },
  { name: 'Contact inbox', href: '/admin/inbox', icon: FiMessageSquare },
  { name: 'Conversations', href: '/admin/chats', icon: FiMessageSquare },
  { name: 'LinkedIn spotlight', href: '/admin/linkedin-posts', icon: FiLinkedin },
];
export default function AdminLayout({ children }) {
  const pathname = usePathname();
  if (pathname === '/admin/login') return children;
  return <AdminWorkspace>{children}</AdminWorkspace>;
}
function Sidebar({ session, pathname, close }) {
  return <>
    <Link href="/admin" className="portal-brand" onClick={close}><span className="portal-monogram">pg<span><FiArrowUpRight /></span></span><span>Plan Ghimire<small>THE WORKSPACE</small></span></Link>
    <div className="portal-nav-label">MANAGE YOUR SPACE</div>
    <nav aria-label="Admin navigation">{navigation.map(({ name, href, icon: Icon }) => {
      const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
      return <Link key={href} href={href} className={`portal-nav-item ${active ? 'is-active' : ''}`} aria-current={active ? 'page' : undefined} onClick={close}><Icon /><span>{name}</span>{active && <span className="portal-nav-dot" />}</Link>;
    })}</nav>
    <Link href="/admin/posts/new" onClick={close} className="portal-compose"><FiPlus /> Create a post <FiArrowUpRight /></Link>
    <div className="portal-sidebar-note"><span className="portal-orbit-icon">✧</span><strong>A space for what’s next.</strong><p>Keep your ideas, stories, and conversations moving.</p><Link href="/" target="_blank" rel="noreferrer">See your portfolio <FiArrowUpRight /></Link></div>
    <div className="portal-account"><span className="portal-avatar">{session.user.name?.charAt(0) || 'P'}</span><div><strong>{session.user.name || 'Administrator'}</strong><small title={session.user.email}>{session.user.email}</small></div><button type="button" aria-label="Sign out" title="Sign out" onClick={() => signOut({ callbackUrl: '/admin/login' })}><FiLogOut /></button></div>
  </>;
}
function trapDrawerFocus(event) {
  if (event.key !== 'Tab') return;
  const controls = [...event.currentTarget.querySelectorAll('a[href], button:not(:disabled)')].filter(element => element.getClientRects().length);
  const first = controls[0], last = controls[controls.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
}
function AdminWorkspace({ children }) {
  const pathname = usePathname(); const router = useRouter();
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false); const dialog = useRef(null);
  const admin = status === 'authenticated' && session?.user?.role === 'admin';
  useEffect(() => { if (status === 'unauthenticated' || (status === 'authenticated' && !admin)) router.replace(`/admin/login?callbackUrl=${encodeURIComponent(pathname)}${status === 'authenticated' ? '&error=AccessDenied' : ''}`); }, [status, admin, pathname, router]);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)');
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);
  useEffect(() => {
    if (!admin || !dialog.current) return;
    if (open) { dialog.current.showModal(); const previous = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = previous; }; }
    dialog.current.close();
  }, [open, admin]);
  if (!admin) return <div className="portal-auth-loading" role="status"><span className="portal-loading-dot" />Opening your workspace…</div>;
  const title = pathname === '/admin/posts/new' ? 'New post' : navigation.find(item => item.href !== '/admin' && pathname.startsWith(item.href))?.name || 'Overview';
  return <div className="portal-shell">
    <a className="portal-skip" href="#admin-content">Skip to admin content</a>
    <aside className="portal-sidebar"><Sidebar session={session} pathname={pathname} /></aside>
    <dialog ref={dialog} id="admin-navigation" className="portal-mobile-drawer" aria-label="Workspace navigation" onKeyDown={trapDrawerFocus} onClose={() => setOpen(false)} onClick={event => { if (event.target === event.currentTarget) setOpen(false); }}>
      <div className="portal-drawer-content"><button className="portal-drawer-close portal-icon-button" type="button" aria-label="Close navigation" onClick={() => setOpen(false)}><FiX /></button><Sidebar session={session} pathname={pathname} close={() => setOpen(false)} /></div>
    </dialog>
    <div className="portal-main">
      <header className="portal-topbar"><div className="portal-breadcrumb"><button className="portal-menu-button portal-icon-button" type="button" aria-label="Open navigation" aria-expanded={open} aria-controls="admin-navigation" onClick={() => setOpen(true)}><FiMenu /></button><span>Workspace</span><FiChevronRight /><strong>{title}</strong></div><div className="portal-topbar-actions"><span className="portal-private"><span />Admin workspace</span><Link href="/" target="_blank" rel="noreferrer" className="portal-site-link">View site <FiArrowUpRight /></Link><span className="portal-avatar portal-topbar-avatar" title={session.user.name}>{session.user.name?.charAt(0) || 'P'}</span></div></header>
      <main id="admin-content" tabIndex={-1} className="portal-page">{children}<footer className="portal-page-footer"><span>Plan Ghimire <span className="portal-footer-dot">·</span> Your creative workspace</span><Link href="/" target="_blank" rel="noreferrer">Made for what’s next <FiArrowUpRight /></Link></footer></main>
    </div>
  </div>;
}
