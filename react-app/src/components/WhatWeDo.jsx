import SectionLabel from './SectionLabel';
import styles from './WhatWeDo.module.css';

export default function WhatWeDo() {
  return (
    <section className={styles.section}>
      <SectionLabel>What we do</SectionLabel>
      <h2 className={styles.heading}>
        Most operational drag isn't one big problem. It's the same small ones, repeated every day.
      </h2>
      <p className={styles.body}>
        Teams adapt to friction. They build workarounds, absorb delays, and learn
        to compensate — until it feels normal. Amplefi identifies what's actually
        slowing your operations down and fixes it at the source. Not with new
        software or a methodology deck. With specific, targeted changes that make
        the day-to-day work easier.
      </p>
    </section>
  );
}
