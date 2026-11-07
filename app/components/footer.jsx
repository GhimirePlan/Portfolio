import Link from 'next/link';
import { personalData } from '@/utils/data/personal-data';

export default function Footer() {
  return <footer className="site-footer"><div><p>© {new Date().getFullYear()} {personalData.name}</p><nav aria-label="Footer navigation"><Link href="/blog">Blog</Link><a href={personalData.github} target="_blank" rel="noopener noreferrer">GitHub</a><a href={personalData.linkedIn} target="_blank" rel="noopener noreferrer">LinkedIn</a><Link href="/#contact">Contact</Link></nav></div></footer>;
}
