import Link from 'next/link';
import './not-found.css';

export default function NotFound() {
  return <section className="not-found-page" aria-labelledby="not-found-heading">
    <div className="not-found-card">
      <p className="not-found-code" aria-hidden="true">404</p>
      <p className="not-found-eyebrow">A SMALL DETOUR</p>
      <h1 id="not-found-heading">This page isn’t here.</h1>
      <p className="not-found-description">The link may have changed, or the page may have moved. There’s still plenty to explore.</p>
      <div className="not-found-actions"><Link href="/" prefetch={false} className="not-found-home">Back to home <span aria-hidden="true">→</span></Link><Link href="/blog" prefetch={false}>Read the blog <span aria-hidden="true">→</span></Link></div>
      <p className="not-found-note">Looking for something? <Link href="/planbot" prefetch={false}>Ask PlanBot</Link></p>
    </div>
  </section>;
}
