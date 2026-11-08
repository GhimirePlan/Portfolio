'use client';
import { useEffect, useState } from 'react';
import { FiUsers, FiEye, FiMousePointer, FiFileText, FiMail, FiArrowUpRight, FiGlobe, FiBarChart2, FiLayers } from 'react-icons/fi';

const metrics = [
  { key: 'uniqueVisitors', title: 'Unique visitors', hint: 'Distinct anonymous browsers', icon: FiUsers, color: 'mint' },
  { key: 'sessions', title: 'Sessions', hint: 'A new visit after 30 minutes idle', icon: FiMousePointer, color: 'blue' },
  { key: 'pageViews', title: 'Page views', hint: 'Public page loads & navigation', icon: FiEye, color: 'lilac' },
  { key: 'resumeClicks', title: 'Résumé clicks', hint: 'Opens of your Google Docs résumé', icon: FiFileText, color: 'blue' },
  { key: 'projectOpens', title: 'Project opens', hint: 'Clicks to your GitHub repositories', icon: FiLayers, color: 'amber' },
  { key: 'contactSubmissions', title: 'Contact submissions', hint: 'Messages received in inbox or email', icon: FiMail, color: 'mint' },
];
const names = { direct: 'Direct / unknown', __other__: 'Other sources', google: 'Google', linkedin: 'LinkedIn', github: 'GitHub', facebook: 'Facebook', x: 'X / Twitter', 'google.com': 'Google', 'linkedin.com': 'LinkedIn', 'l.linkedin.com': 'LinkedIn', 'github.com': 'GitHub', 't.co': 'X / Twitter', 'facebook.com': 'Facebook' };
const sourceName = value => Object.prototype.hasOwnProperty.call(names, value) ? names[value] : value;
export default function AudienceAnalytics({ refreshKey = 0 }) {
  const [days, setDays] = useState(30), [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({ loading: true });
  useEffect(() => {
    const controller = new AbortController(); let active = true;
    setState({ loading: true });
    fetch(`/api/admin/analytics?days=${days}`, { cache: 'no-store', signal: controller.signal })
      .then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.message || 'Analytics could not be loaded.'); return data; })
      .then(data => { if (active) setState({ data }); })
      .catch(error => { if (active) setState({ error: error.message }); });
    return () => { active = false; controller.abort(); };
  }, [days, attempt, refreshKey]);
  const data = state.data;
  const empty = message => <p className="portal-analytics-empty">{message}</p>;
  return <section className="portal-audience" aria-labelledby="audience-heading">
    <header className="portal-audience-heading"><div><p className="portal-eyebrow">THE PEOPLE BEHIND THE NUMBERS</p><h2 id="audience-heading">Audience &amp; impact<span>.</span></h2><p>{data?.trackingSince ? `Collecting since ${new Date(data.trackingSince).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}` : 'Fresh analytics, collected from this update onward.'}</p></div><div className="portal-analytics-controls"><label htmlFor="analytics-period">Period <span>· UTC</span></label><select id="analytics-period" value={days} onChange={event => setDays(Number(event.target.value))}><option value={7}>Last 7 days</option><option value={30}>Last 30 days</option><option value={90}>Last 90 days</option></select><button type="button" onClick={() => setAttempt(value => value + 1)} disabled={state.loading} aria-label="Refresh audience analytics">↻</button></div></header>
    {state.error && <div role="alert" className="portal-error"><FiBarChart2 /><p>{state.error} <button onClick={() => setAttempt(value => value + 1)}>Retry analytics</button></p></div>}
    <div className="portal-analytics-metrics" aria-live="polite">{metrics.map(({ key, title, hint, icon: Icon, color }) => <article key={key} className={`portal-stat portal-stat-${color}`}><div><span className="portal-stat-icon"><Icon /></span></div><strong className="portal-stat-value">{data ? data.totals[key].toLocaleString() : state.loading ? <span className="portal-skeleton" /> : '—'}</strong><h3>{title}</h3><p>{hint}</p></article>)}</div>
    <div className="portal-analytics-breakdowns">
      <section className="portal-panel"><div className="portal-panel-heading"><h3><FiGlobe /> Traffic sources</h3><span className="portal-tag">Sessions</span></div><div className="portal-analytics-rows">{data ? data.sources.length ? data.sources.map(source => <div className="portal-source-row" key={source.source}><div><span title={source.source}>{sourceName(source.source)}</span><strong>{source.sessions.toLocaleString()}</strong></div><div className="portal-source-track"><span style={{ width: `${Math.min(100, source.sessions / Math.max(1, data.totals.sessions) * 100)}%` }} /></div></div>) : empty('Sources will appear after the first tracked visit.') : empty(state.loading ? 'Loading sources…' : 'Refresh analytics to load traffic sources.')}</div></section>
      <section className="portal-panel"><div className="portal-panel-heading"><h3><FiLayers /> Most opened projects</h3><span className="portal-tag">Link opens</span></div><div className="portal-analytics-rows">{data ? data.projects.length ? data.projects.map((project, index) => <a className="portal-ranked-row" href={project.url} key={project.url} target="_blank" rel="noreferrer"><span className="portal-rank">{String(index + 1).padStart(2, '0')}</span><span title={project.name}>{project.name}</span><strong>{project.opens.toLocaleString()}</strong><FiArrowUpRight /></a>) : empty('Repository-link opens from your blog and PlanBot will appear here. Your projects section stays hidden.') : empty(state.loading ? 'Loading projects…' : 'Refresh analytics to load project opens.')}</div></section>
      <section className="portal-panel"><div className="portal-panel-heading"><h3><FiEye /> Most visited pages</h3><span className="portal-tag">Page views</span></div><div className="portal-analytics-rows">{data ? data.pages.length ? data.pages.map((page, index) => <div className="portal-ranked-row" key={page.path}><span className="portal-rank">{String(index + 1).padStart(2, '0')}</span><span title={page.path}>{page.path === '/' ? 'Homepage' : page.path}</span><strong>{page.views.toLocaleString()}</strong></div>) : empty('Popular pages will appear as visitors explore your site.') : empty(state.loading ? 'Loading pages…' : 'Refresh analytics to load page views.')}</div></section>
    </div>
    <p className="portal-analytics-note">Visitors are anonymous browser estimates, not identified people. Résumé and project figures measure link clicks, not confirmed file saves or destination-page views. Contact submissions are counted server-side after inbox storage or email acceptance; failed receipts are excluded.</p>
  </section>;
}
