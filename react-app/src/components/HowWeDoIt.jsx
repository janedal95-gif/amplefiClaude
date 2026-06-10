import SectionLabel from './SectionLabel';
import styles from './HowWeDoIt.module.css';

const steps = [
  {
    label: 'Step 1',
    title: 'A week on the floor',
    description:
      'Jane sits with the people who actually do the work — not the org chart, not management. For at least a week, she learns the process start to finish: every tool in use (Excel, SharePoint, Monday, a notebook, whatever it is), every workaround, every place the work slows down or quietly breaks.',
    story:
      'At a GI clinic, nobody knew the scheduling system had 32 separate appointment types until someone spent time mapping the actual process. Staff had been building workarounds for years — invisible to everyone above them.',
  },
  {
    label: 'Step 2',
    title: 'Map it for the people who can fix it',
    description:
      'Jane brings her findings to John, who builds a clear picture of how work actually moves through the operation — and where it doesn\'t. Management sees the bottlenecks and tension points for the first time, in terms they can act on.',
    story:
      'The map revealed 204 open appointment slots hidden inside a system that had been telling patients there was no availability for 8 weeks. Leadership could act on what they could finally see.',
  },
  {
    label: 'Step 3',
    title: 'Implement — and leave you ready for what\'s next',
    description:
      'We make the changes with you. When we\'re done, you\'re not dependent on us to maintain it. You\'re running a system that\'s ready for the next upgrade — not set up for the next failure.',
    story:
      'Two months in, results were 6 months ahead of the physician\'s own projected timeline. Staff kept accelerating after the engagement ended. "My job isn\'t to convince them to change anymore."',
  },
];

export default function HowWeDoIt() {
  return (
    <section id="how" className={styles.section}>
      <div className={styles.grid}>
        <div className={styles.lead}>
          <SectionLabel>How we do it</SectionLabel>
          <p className={styles.leadNote}>One week on the floor. A map for leadership. Changes that hold.</p>
        </div>
        <div>
          <h2 className={styles.heading}>
            We learn how work actually moves through your operation — then fix it.
          </h2>
          <div className={styles.compare}>
            <div className={`${styles.row} ${styles.head}`}>
              <span></span>
              <span>What we do</span>
            </div>
            {steps.map((step) => (
              <div key={step.label} className={styles.row}>
                <div className={styles.stepLabel}>{step.label}</div>
                <div className={styles.stepContent}>
                  <p className={styles.stepTitle}>{step.title}</p>
                  <p className={styles.stepDesc}>{step.description}</p>
                  <p className={styles.story}>{step.story}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
