'use client';

import { useRef, useState } from 'react';
import { experiences } from '@/utils/data/experience';
import { FaCode, FaMicrochip, FaNetworkWired, FaChevronLeft, FaChevronRight, FaCog, FaLayerGroup, FaCalendarAlt } from 'react-icons/fa';
import styles from './experience.module.css';

const iconMap = { code: FaCode, chip: FaMicrochip, network: FaNetworkWired };

export default function Experience() {
  const [active, setActive] = useState(1);
  const tabs = useRef([]);
  const gesture = useRef(null);
  const swiped = useRef(false);
  const total = experiences.length;
  const selected = experiences[active];
  const Icon = iconMap[selected.icon] || FaCode;
  const move = (direction) => setActive((current) => (current + direction + total) % total);
  const handleKey = (event) => {
    const key = event.key;
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(key)) return;
    event.preventDefault();
    const next = key === 'Home' ? 0 : key === 'End' ? total - 1 : (active + (key === 'ArrowRight' ? 1 : -1) + total) % total;
    setActive(next); tabs.current[next]?.focus();
  };
  const startSwipe = (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    swiped.current = false;
    gesture.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
  };
  const endSwipe = (event) => {
    const start = gesture.current; gesture.current = null;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x, dy = event.clientY - start.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) { swiped.current = true; move(dx < 0 ? 1 : -1); }
  };

  return (
    <section id="experience" className={styles.section} aria-labelledby="experience-heading">
      <header className={styles.heading}>
        <p className={styles.eyebrow}><span aria-hidden="true" />Experience &amp; Journey<span aria-hidden="true" /></p>
        <h2 id="experience-heading">What I <span>Work With</span></h2>
        <p className={styles.intro}>Exploring software, electronics, and computer systems through hands-on development, academic work, and independent learning.</p>
      </header>
      <div className={styles.workspace}>
        <div className={styles.stage} onPointerDown={startSwipe} onPointerUp={endSwipe} onPointerCancel={() => { gesture.current = null; }} onPointerLeave={() => { gesture.current = null; }} onClickCapture={(event) => { if (swiped.current) { event.preventDefault(); event.stopPropagation(); swiped.current = false; } }}>
          <div className={styles.floor} aria-hidden="true" />
          <div className={styles.cards} role="tablist" aria-label="Areas of experience" onKeyDown={handleKey}>
            {experiences.map((experience, index) => {
              let offset = (index - active + total) % total;
              if (offset > total / 2) offset -= total;
              const CardIcon = iconMap[experience.icon] || FaCode;
              return <button key={experience.id} ref={(element) => { tabs.current[index] = element; }} type="button" role="tab" id={`experience-tab-${experience.id}`} aria-controls="experience-panel" aria-selected={index === active} tabIndex={index === active ? 0 : -1} onClick={() => setActive(index)} className={`${styles.card} ${offset === 0 ? styles.activeCard : offset < 0 ? styles.leftCard : styles.rightCard}`} style={{ '--offset': offset }}>
                <span className={styles.cardIcon}><CardIcon aria-hidden="true" /></span>
                <span className={styles.cardTitle}>{experience.title}</span>
                <span className={styles.cardRule} aria-hidden="true" />
                <span className={styles.tagline}>{experience.tagline}</span>
                <span className={styles.duration}>{experience.duration}</span>
              </button>;
            })}
          </div>
          <button type="button" className={`${styles.arrow} ${styles.previous}`} onClick={() => move(-1)} aria-label="Previous experience"><FaChevronLeft aria-hidden="true" /></button>
          <button type="button" className={`${styles.arrow} ${styles.next}`} onClick={() => move(1)} aria-label="Next experience"><FaChevronRight aria-hidden="true" /></button>
          <div className={styles.dots}>{experiences.map((experience, index) => <button key={experience.id} type="button" aria-label={`Show ${experience.title}`} aria-pressed={index === active} onClick={() => setActive(index)}><span /></button>)}</div>
        </div>
        <div id="experience-panel" role="tabpanel" aria-labelledby={`experience-tab-${selected.id}`} tabIndex={0} className={styles.panel}>
          <div key={selected.id} className={styles.panelContent}>
            <header className={styles.panelHeader}><span className={styles.featureIcon}><Icon aria-hidden="true" /></span><div><h3>{selected.title}</h3><p><FaCalendarAlt aria-hidden="true" />{selected.duration}</p></div></header>
            <p className={styles.description}>{selected.description}</p>
            <div className={styles.details}>
              <div><h4><FaCog aria-hidden="true" />Key Activities</h4><ul className={styles.activities}>{selected.activities.map((activity) => <li key={activity}>{activity}</li>)}</ul></div>
              <div className={styles.technologyGroup}><h4><FaLayerGroup aria-hidden="true" />Technologies</h4><ul className={styles.technologies}>{selected.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul></div>
            </div>
          </div>
        </div>
      </div>
      <p className={styles.hint}>Drag or use arrows to explore different phases of my journey</p>
    </section>
  );
}
