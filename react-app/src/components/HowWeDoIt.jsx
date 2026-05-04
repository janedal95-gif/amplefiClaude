import SectionLabel from './SectionLabel';
import styles from './HowWeDoIt.module.css';

const steps = [
  {
    title: 'Operational study',
    description:
      'We spend time with your team to understand how work actually moves \u2014 where it flows, where it stalls, and where people are quietly compensating for gaps.',
  },
  {
    title: 'Targeted fixes',
    description:
      'We identify the specific friction points creating the most drag and design direct, simple interventions. No theoretical frameworks. No generic recommendations.',
  },
  {
    title: 'On-the-floor execution',
    description:
      'We implement changes with your team, not just deliver findings. We stay until the fix holds and the problem stops recurring.',
  },
];

export default function HowWeDoIt() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <SectionLabel>How we do it</SectionLabel>
        <h2 className={styles.heading}>
          Three steps. No overhead, no shelfware.
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
  );
}
