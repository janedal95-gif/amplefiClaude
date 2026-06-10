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
            We help experienced professionals build systems that survive what's coming.
          </h2>
          <div className={styles.body}>
            <p>Mid-to-late career professionals have spent years building how they work. AI is about to get forced into that — and most of those systems weren't built to absorb it.</p>
          </div>
          <ul className={styles.list}>
            <li>Workflows designed for a world without AI.</li>
            <li>Documented processes that don't match how work actually happens.</li>
            <li>Tools layered on top of problems that were never fixed.</li>
          </ul>
          <div className={styles.body}>
            <p>Amplefi builds the playbook with you — live, hands-on — so your systems are solid before they're tested.</p>
          </div>
          <p className={styles.closing}>We don't sell courses or hand you templates. We implement.</p>
        </div>
      </div>
    </section>
  );
}
