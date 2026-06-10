import SectionLabel from './SectionLabel';
import styles from './WhatWeDo.module.css';

export default function WhatWeDo() {
  return (
    <section id="what" className={styles.section}>
      <div className={styles.grid}>
        <div className={styles.lead}>
          <SectionLabel>What we do</SectionLabel>
          <p className={styles.leadNote}>Operational implementation before AI forces your hand.</p>
        </div>
        <div>
          <h2 className={styles.heading}>
            You've spent years building how you work. That's not a liability — <em>it's exactly what we build from.</em>
          </h2>
          <ul className={styles.list}>
            <li>Workflows designed for a world without AI.</li>
            <li>Documented processes that don't match how work actually happens.</li>
            <li>Tools layered on top of problems that were never fixed.</li>
          </ul>
          <div className={styles.body}>
            <p>Amplefi maps how you actually operate — not how you think you do — and builds the systems that make AI land as an upgrade.</p>
          </div>
          <p className={styles.closing}>We don't just teach you how to run an office. We operationalize one with you.</p>
        </div>
      </div>
    </section>
  );
}
