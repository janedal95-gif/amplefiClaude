import SectionLabel from './SectionLabel';
import styles from './HowWeDoIt.module.css';

const steps = [
  {
    title: 'Operational study',
    description:
      'We embed with your team onsite to map your real workflows \u2014 where decisions stall, where handoffs break, and where staff are compensating for system gaps.',
  },
  {
    title: 'Preemptive protocols',
    description:
      'We design clinical and operational protocols that trigger action before problems escalate \u2014 around discharge readiness, bed assignment, and early risk signals.',
  },
  {
    title: 'Distributed authority',
    description:
      'We push decision-making to the floor with clear escalation paths, so the right people act in real time instead of waiting for permission.',
  },
];

export default function HowWeDoIt() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <SectionLabel>How we do it</SectionLabel>
        <h2 className={styles.heading}>
          Three steps. Built around your operations, not around software.
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
