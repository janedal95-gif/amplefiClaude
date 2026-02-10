import SectionLabel from './SectionLabel';
import styles from './WhatWeDo.module.css';

export default function WhatWeDo() {
  return (
    <section className={styles.section}>
      <SectionLabel>What we do</SectionLabel>
      <h2 className={styles.heading}>
        We help hospitals see constraints earlier and act while there is still time.
      </h2>
      <p className={styles.body}>
        Amplefi is a hospital management system that replaces reactive scrambling
        with preemptive operations. We surface patient flow bottlenecks, discharge
        delays, and clinical risks before they cascade, and we put decisions in the
        hands of the people on the floor who can act on them.
      </p>
    </section>
  );
}
