import SectionLabel from './SectionLabel';
import styles from './Differentiation.module.css';

const points = [
  "No reports that sit on a shelf",
  "No new tools to manage",
  "No abstract frameworks",
  "Direct interventions that make the work easier",
];

export default function Differentiation() {
  return (
    <section className={styles.section}>
      <SectionLabel>Why it works</SectionLabel>
      <h2 className={styles.heading}>Most firms diagnose. We remove.</h2>
      <ul className={styles.list}>
        {points.map((point) => (
          <li key={point} className={styles.item}>{point}</li>
        ))}
      </ul>
    </section>
  );
}
