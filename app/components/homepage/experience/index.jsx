import { experiences } from '@/utils/data/experience';
import { FaCode, FaMicrochip, FaNetworkWired, FaChevronDown } from 'react-icons/fa';
import styles from './experience.module.css';

const iconMap = { code: FaCode, chip: FaMicrochip, network: FaNetworkWired };

export default function Experience() {
  return (
    <section id="experience" className={styles.section} aria-labelledby="experience-heading">
      <header className={styles.heading}>
        <p className={styles.eyebrow}><span aria-hidden="true" />Experience &amp; Journey</p>
        <h2 id="experience-heading">What I Work With</h2>
        <p className={styles.intro}>Exploring software, electronics, and computer systems through hands-on development, academic work, and independent learning.</p>
      </header>
      <div className={styles.areas}>
        {experiences.map((experience, index) => {
          const Icon = iconMap[experience.icon] || FaCode;
          return (
            <article key={experience.id} className={styles.area} aria-labelledby={`experience-title-${experience.id}`}>
              <header className={styles.areaHeader}>
                <div className={styles.meta}><span className={styles.number}>0{index + 1}</span><span>{experience.duration}</span></div>
                <div className={styles.title}><span className={styles.icon}><Icon aria-hidden="true" /></span><h3 id={`experience-title-${experience.id}`}>{experience.title}</h3></div>
              </header>
              <div className={styles.copy}><p className={styles.tagline}>{experience.tagline}</p><p className={styles.description}>{experience.description}</p></div>
              <div className={styles.technologyGroup}><h4>Technologies</h4><ul className={styles.technologies} aria-label={`${experience.title} technologies`}>{experience.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul></div>
              <details className={styles.activities}>
                <summary>Key Activities<FaChevronDown aria-hidden="true" /></summary>
                <ul>{experience.activities.map((activity) => <li key={activity}>{activity}</li>)}</ul>
              </details>
            </article>
          );
        })}
      </div>
    </section>
  );
}
