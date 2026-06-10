import Button from './Button';
import SectionLabel from './SectionLabel';
import styles from './CtaBottom.module.css';

export default function CtaBottom({ onRequestDemo }) {
  return (
    <section id="contact" className={styles.section}>
      <div className={styles.bg} aria-hidden="true">
        <img src="/amplefi-water.jpeg" alt="" />
      </div>
      <div className={styles.grid}>
        <div className={styles.lead}>
          <SectionLabel className={styles.labelLight}>Begin</SectionLabel>

        </div>
        <div>
          <h3 className={styles.heading}>
            You built this operation deliberately.<br />
            <em>Build the next version the same way.</em>
          </h3>
          <div className={styles.actions}>
            <Button onClick={onRequestDemo} arrow className={styles.ctaBtn}>
              Start with a Workflow Assessment
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
