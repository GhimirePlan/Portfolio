'use client';

import HeroSection from './components/homepage/hero-section';
import AboutSection from './components/homepage/about';
import Experience from './components/homepage/experience';
import Blog from './components/homepage/blog';
import LinkedInSection from './components/homepage/LinkedInSection';
import ContactSection from './components/homepage/contact';
import './css/homepage.css';

export default function HomePage() {
  return <div className="portfolio-home"><HeroSection /><AboutSection /><Experience /><Blog /><LinkedInSection /><ContactSection /></div>;
}
