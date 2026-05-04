import SectionLabel from './SectionLabel';
import styles from './HowWeDoIt.module.css';

const steps = [
  {
    title: 'Operational study',
    description: 'We work alongside your team to understand how work actually moves — where it flows, where it stalls, and what people do to get around the gaps.',
  },
  {
    title: 'Targeted fixes',
    description: 'We pinpoint the specific issues causing the most drag and design direct, simple interventions. No frameworks. No generic playbooks.',
  },
  {
    title: 'On-the-floor execution',
    description: 'We implement changes with your team — not in a deck, not from a distance. We stay until the fix is in place and the problem stops recurring.',
  },
];

export default function HowWeDoIt() {
  return (
    <section id="how" className={styles.section}>
      <div className={styles.grid}>
        <div className={styles.lead}>
          <SectionLabel>How we do it</SectionLabel>
          <p className={styles.leadNote}>A direct sequence — study, design, install — done on the floor with your team.</p>
        </div>
        <div>
          <h2 className={styles.heading}>
            Three steps. <em>No overhead</em>, no shelfware.
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
