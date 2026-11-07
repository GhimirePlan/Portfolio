'use client';

import { personalData } from '@/utils/data/personal-data';
import { BsEnvelope, BsTelephone, BsGeoAlt, BsCalendar, BsGithub, BsLinkedin, BsTwitterX, BsFacebook, BsArrowUpRight } from 'react-icons/bs';
import ContactForm from './contact-form';

function meetingUrl() {
  const start = new Date(Date.now() + 30 * 60000);
  start.setMinutes(Math.ceil(start.getMinutes() / 30) * 30, 0, 0);
  const end = new Date(start.getTime() + 30 * 60000);
  const format = (date) => date.toISOString().replace(/[-:]|\.\d+/g, '');
  return `https://calendar.google.com/calendar/render?${new URLSearchParams({ action: 'TEMPLATE', text: 'Meeting with Plan Ghimire', details: 'Discuss project opportunities and collaboration', location: 'Google Meet', dates: `${format(start)}/${format(end)}`, add: personalData.email })}`;
}
export default function ContactSection() {
  return <section id="contact" className="site-contact site-container" aria-labelledby="contact-heading"><div className="site-contact-info"><p className="site-eyebrow">Get in touch</p><h2 id="contact-heading">Connect with me</h2><div className="site-contact-details"><a href={`mailto:${personalData.email}`}><BsEnvelope aria-hidden="true" /><span>{personalData.email}</span><BsArrowUpRight aria-hidden="true" /></a><a href={`tel:${personalData.phone.replace(/\s/g, '')}`}><BsTelephone aria-hidden="true" /><span>{personalData.phone}</span></a><p><BsGeoAlt aria-hidden="true" /><span>{personalData.address}</span></p></div><a href={meetingUrl()} target="_blank" rel="noopener noreferrer" className="site-button site-button-secondary"><BsCalendar aria-hidden="true" />Schedule a meeting<BsArrowUpRight aria-hidden="true" /></a><div className="site-social-links">{[[personalData.github, BsGithub, 'GitHub'], [personalData.linkedIn, BsLinkedin, 'LinkedIn'], [personalData.twitter, BsTwitterX, 'Twitter'], [personalData.facebook, BsFacebook, 'Facebook']].map(([url, Icon, name]) => <a key={name} href={url} aria-label={name} target="_blank" rel="noopener noreferrer"><Icon aria-hidden="true" /></a>)}</div></div><ContactForm /></section>;
}
