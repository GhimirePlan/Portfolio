'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useSession, signOut } from 'next-auth/react';
import { FaBars, FaTimes, FaMoon, FaSun, FaUser, FaSearch } from 'react-icons/fa';

export default function Navbar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const account = useRef(null);
  const mobileToggle = useRef(null);
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setMenuOpen(false); setAccountOpen(false); }, [pathname]);
  useEffect(() => {
    const close = (event) => {
      if (event.type === 'keydown' && event.key === 'Escape') {
        if (menuOpen) mobileToggle.current?.focus();
        setMenuOpen(false); setAccountOpen(false);
      } else if (event.type === 'pointerdown' && !account.current?.contains(event.target)) setAccountOpen(false);
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', close);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', close); };
  }, [menuOpen]);
  const links = [{ name: 'Home', href: '/' }, { name: 'About', href: '/#about' }, { name: 'Blog', href: '/blog' }, { name: 'Contact', href: '/#contact' }];
  const closeMenu = () => setMenuOpen(false);
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-signature" aria-label="Plan Ghimire home">Plan Ghimire</Link>
        <nav className="site-desktop-nav" aria-label="Primary navigation">{links.map((link) => <Link key={link.name} href={link.href} aria-current={link.href === '/' ? (pathname === '/' ? 'page' : undefined) : (link.href === '/blog' && pathname.startsWith('/blog') ? 'page' : undefined)}>{link.name}</Link>)}</nav>
        <div className="site-header-actions">
          <Link href="/blog#blog-search" className="site-icon-button site-search-link" aria-label="Search blog"><FaSearch /></Link>
          <button type="button" className="site-icon-button" aria-label="Toggle color theme" onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>{mounted && resolvedTheme === 'light' ? <FaSun /> : <FaMoon />}</button>
          <div ref={account} className="site-account">
            <button type="button" className="site-icon-button" aria-label="User menu" aria-expanded={accountOpen} aria-controls="site-account-menu" onClick={() => setAccountOpen((open) => !open)}><FaUser /></button>
            {accountOpen && <div id="site-account-menu" className="site-account-menu">{session ? <><p>{session.user?.name}</p><Link href="/profile" onClick={() => setAccountOpen(false)}>My profile</Link>{session.user?.role === 'admin' && <Link href="/admin">Admin dashboard</Link>}<button type="button" onClick={() => signOut({ callbackUrl: '/' })}>Sign out</button></> : <Link href="/login" onClick={() => setAccountOpen(false)}>Sign in</Link>}</div>}
          </div>
          <button ref={mobileToggle} type="button" className="site-icon-button site-menu-toggle" aria-label="Toggle mobile menu" aria-expanded={menuOpen} aria-controls="site-mobile-menu" onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <FaTimes /> : <FaBars />}</button>
        </div>
      </div>
      {menuOpen && <nav id="site-mobile-menu" className="site-mobile-nav" aria-label="Mobile navigation">{links.map((link) => <Link key={link.name} href={link.href} onClick={closeMenu}>{link.name}</Link>)}<Link href="/planbot" onClick={closeMenu}>PlanBot</Link></nav>}
    </header>
  );
}
