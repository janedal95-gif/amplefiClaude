import SectionLabel from './SectionLabel';
import styles from './Differentiation.module.css';

const rows = [
  {
    topic: 'Outputs',
    them: 'Reports, decks, recommendations.',
    ours: 'Direct interventions that make the work easier.',
  },
  {
    topic: 'Tooling',
    them: 'New software, new dashboards to manage.',
    ours: 'No new tools to manage.',
  },
  {
    topic: 'Method',
    them: 'Abstract frameworks, off-the-shelf playbooks.',
    ours: 'Specific fixes for specific problems.',
  },
  {
    topic: 'Aftermath',
    them: 'Reports that sit on a shelf.',
    ours: 'A team that no longer has to work around it.',
  },
];

export default function Differentiation() {
  return (
    <section id="why" className={styles.section}>
      <div className={styles.grid}>
        <div className={styles.lead}>
          <SectionLabel>Why it works</SectionLabel>
          <p className={styles.leadNote}>Most firms diagnose. We remove.</p>
        </div>
        <div>
          <h2 className={styles.heading}>
            Most firms <em>diagnose.</em> We remove.
          </h2>
          <div className={styles.compare}>
            <div className={`${styles.row} ${styles.head}`}>
              <span>Concern</span>
              <span>Typical engagement</span>
              <span className={styles.us}>Amplefi</span>
            </div>
            {rows.map((r) => (
              <div key={r.topic} className={styles.row}>
                <div className={styles.topic}>{r.topic}</div>
                <div className={styles.them}>{r.them}</div>
                <div className={styles.ours}>{r.ours}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
