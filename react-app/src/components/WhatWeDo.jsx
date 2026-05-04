import SectionLabel from './SectionLabel';
import styles from './WhatWeDo.module.css';

export default function WhatWeDo() {
  return (
    <section id="what" className={styles.section}>
      <div className={styles.grid}>
        <div className={styles.lead}>
          <SectionLabel>What we do</SectionLabel>
          <p className={styles.leadNote}>A practice for the recurring problems no one has time to solve.</p>
        </div>
        <div>
          <h2 className={styles.heading}>
            Most operational drag isn't one big problem. It's the same small ones, <em>repeated every day.</em>
          </h2>
          <div className={styles.body}>
            <p>Teams adapt to problems. They build workarounds, absorb delays, and learn to compensate — until the workaround becomes the process.</p>
          </div>
          <ul className={styles.list}>
            <li>Delays that recur the same way, every time.</li>
            <li>Handoffs that break in predictable places.</li>
            <li>Decisions that wait for people who aren't there.</li>
          </ul>
          <div className={styles.body}>
            <p>Amplefi identifies the root cause of each one and removes it directly.</p>
          </div>
          <p className={styles.closing}>No new systems. No added complexity. Just fewer problems.</p>
        </div>
      </div>
    </section>
  );
}
