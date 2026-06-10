import SectionLabel from './SectionLabel';
import styles from './Differentiation.module.css';

const rows = [
  {
    topic: 'Outputs',
    them: 'Reports, decks, recommendations.',
    ours: 'Operational systems built and running.',
    story: 'A GI clinic cleared a 207-patient endoscopy backlog in a single day — without new staff, new software, or new space.',
  },
  {
    topic: 'Tooling',
    them: 'New software, new dashboards to manage.',
    ours: 'No new tools. No new logins. Nothing to manage.',
    story: 'The clinic already had 204 open appointment slots. They were hidden behind 32 scheduling types nobody knew existed. The fix was simplification, not technology.',
  },
  {
    topic: 'Method',
    them: 'Abstract frameworks, off-the-shelf playbooks.',
    ours: 'Built around how you actually work.',
    story: 'Nobody knew the scheduling system had 32 appointment types until someone mapped it. "I had no idea what complexity we had built into this system."',
  },
  {
    topic: 'Aftermath',
    them: 'A roadmap you now have to execute.',
    ours: 'A running operation, ready for what\'s next.',
    story: 'New patient wait dropped from 10–12 weeks to under 2. Results came 6 months ahead of the physician\'s own projected timeline.',
  },
];

export default function Differentiation() {
  return (
    <section id="why" className={styles.section}>
      <div className={styles.grid}>
        <div className={styles.lead}>
          <SectionLabel>Why it works</SectionLabel>
          <p className={styles.leadNote}>Most advisors leave you a plan. We leave you a running operation.</p>
        </div>
        <div>
          <h2 className={styles.heading}>
            Most advisors leave you a plan. <em>We leave you a running operation.</em>
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
                <div className={styles.oursCol}>
                  <div className={styles.ours}>{r.ours}</div>
                  {r.story && <p className={styles.story}>{r.story}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
