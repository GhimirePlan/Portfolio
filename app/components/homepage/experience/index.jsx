"use client";

import { useRef, useState } from "react";
import { experiences } from "@/utils/data/experience";
import {
  FaCode, FaMicrochip, FaNetworkWired, FaLayerGroup,
  FaCalendarAlt, FaChevronLeft, FaChevronRight, FaArrowRight,
} from "react-icons/fa";
import styles from "./experience.module.css";

const iconMap = { code: FaCode, chip: FaMicrochip, network: FaNetworkWired };

export default function Experience() {
  const [active, setActive] = useState(1);
  const tabs = useRef([]);
  const gesture = useRef(null);
  const selected = experiences[active];
  const Icon = iconMap[selected.icon] || FaCode;
  const total = experiences.length;
  const selectRelative = (offset) => setActive((current) => (current + offset + total) % total);

  const handleTabKey = (event) => {
    let next;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (active + 1) % total;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (active - 1 + total) % total;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = total - 1;
    if (next === undefined) return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  const startGesture = (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    gesture.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
  };

  const finishGesture = (event) => {
    const start = gesture.current;
    gesture.current = null;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      selectRelative(dx < 0 ? 1 : -1);
    }
  };

  return (
    <section id="experience" className={styles.section} aria-labelledby="experience-heading">
      <header className={styles.heading}>
        <div>
          <p className={styles.eyebrow}><span aria-hidden="true" />Experience &amp; Journey</p>
          <h2 id="experience-heading">What I <span>Work With</span></h2>
        </div>
        <p className={styles.intro}>
          Exploring software, electronics, and computer systems through hands-on development, academic work, and independent learning.
        </p>
      </header>

      <div className={styles.workspace}>
        <div className={styles.sidebar}>
          <div className={styles.tabs} role="tablist" aria-label="Areas of experience" onKeyDown={handleTabKey}>
            {experiences.map((experience, index) => {
              const TabIcon = iconMap[experience.icon] || FaCode;
              const isActive = index === active;
              return (
                <button
                  key={experience.id}
                  ref={(element) => { tabs.current[index] = element; }}
                  id={`experience-tab-${experience.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="experience-panel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActive(index)}
                  className={`${styles.tab} ${isActive ? styles.selected : ""}`}
                >
                  <span className={styles.tabTop}>
                    <span className={styles.tabIcon}><TabIcon aria-hidden="true" /></span>
                    <span className={styles.tabNumber} aria-hidden="true">0{index + 1}</span>
                  </span>
                  <span className={styles.tabTitle}>{experience.title}</span>
                  <span className={styles.tagline}>{experience.tagline}</span>
                  <span className={styles.tabBottom}>
                    <span className={styles.duration}>{experience.duration}</span>
                    <FaArrowRight className={styles.tabArrow} aria-hidden="true" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          id="experience-panel"
          role="tabpanel"
          aria-labelledby={`experience-tab-${selected.id}`}
          tabIndex={0}
          className={styles.panel}
          onPointerDown={startGesture}
          onPointerUp={finishGesture}
          onPointerCancel={() => { gesture.current = null; }}
          onPointerLeave={() => { gesture.current = null; }}
        >
          <div key={selected.id} className={styles.panelContent}>
            <div className={styles.panelHeader}>
              <span className={styles.featureIcon}><Icon aria-hidden="true" /></span>
              <span className={styles.panelIndex} aria-hidden="true">0{active + 1}<span> / 0{total}</span></span>
            </div>
            <div className={styles.titleRow}>
              <h3>{selected.title}</h3>
              <span className={styles.period}><FaCalendarAlt aria-hidden="true" />{selected.duration}</span>
            </div>
            <p className={styles.description}>{selected.description}</p>

            <div className={styles.details}>
              <div>
                <h4><span className={styles.smallLine} aria-hidden="true" />Key Activities</h4>
                <ul className={styles.activities}>
                  {selected.activities.map((activity, index) => (
                    <li key={activity}>
                      <span className={styles.activityNumber} aria-hidden="true">0{index + 1}</span>
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.technologyColumn}>
                <h4><FaLayerGroup aria-hidden="true" />Technologies</h4>
                <div className={styles.technologies}>
                  {selected.technologies.map((technology) => <span key={technology}>{technology}</span>)}
                </div>
              </div>
            </div>
          </div>
          <footer className={styles.controls}>
            <p>Drag or use arrows to explore different phases of my journey</p>
            <div>
              <button type="button" onClick={() => selectRelative(-1)} aria-label="Previous experience"><FaChevronLeft aria-hidden="true" /></button>
              <button type="button" onClick={() => selectRelative(1)} aria-label="Next experience"><FaChevronRight aria-hidden="true" /></button>
            </div>
          </footer>
        </div>
      </div>
    </section>
  );
}
