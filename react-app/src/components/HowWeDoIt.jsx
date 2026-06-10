import SectionLabel from './SectionLabel';
import styles from './HowWeDoIt.module.css';

const steps = [
  {
    title: 'Workflow audit',
    description:
      'We map how you actually operate — where decisions get made, where handoffs happen, and where your real workflows live versus what\'s documented.',
  },
  {
    title: 'System design',
    description:
      'We build the operational systems that reflect that reality — clear, maintainable, and built to absorb change without breaking.',
  },
  {
    title: 'Live implementation',
    description:
      'We don\'t hand you a manual and walk away. We implement it with you so it\'s running before we leave.',
  },
];

export default function HowWeDoIt() {
  return (
    <section id="how" className={styles.section}>
      <div className={styles.grid}>
        <div className={styles.lead}>
          <SectionLabel>How we do it</SectionLabel>
          <p className={styles.leadNote}>A direct sequence — audit, design, implement — done with your team.</p>
        </div>
        <div>
          <h2 className={styles.heading}>
            Three steps. Built around how you actually work, not how AI assumes you do.
          </h2>
          <ol className={styles.steps}>
            {steps.map((step) => (
              <li key={step.title} className={styles.step}>
                <p className={styles.stepTitle}>{step.title}</p>
                <p className={styles.stepDesc}>{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
