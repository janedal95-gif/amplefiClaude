import SectionLabel from './SectionLabel';
import styles from './WhatWeDo.module.css';

export default function WhatWeDo() {
  return (
    <section className={styles.section}>
      <SectionLabel>What we do</SectionLabel>
      <h2 className={styles.heading}>
        Most operational drag isn't one big problem. It's the same small ones, repeated every day.
      </h2>
      <div className={styles.body}>
        <p>Teams adapt to problems. They build workarounds, absorb delays, and learn to compensate — until the workaround becomes the process.</p>
        <ul className={styles.list}>
          <li>Delays that recur the same way, every time</li>
          <li>Handoffs that break in predictable places</li>
          <li>Decisions that wait for people who aren't there</li>
        </ul>
        <p>Amplefi identifies the root cause of each one and removes it directly.</p>
        <p className={styles.closing}>No new systems. No added complexity. Just fewer problems.</p>
      </div>
    </section>
  );
}
