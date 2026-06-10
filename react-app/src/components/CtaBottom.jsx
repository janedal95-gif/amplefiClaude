import Button from './Button';
import SectionLabel from './SectionLabel';
import styles from './CtaBottom.module.css';

export default function CtaBottom({ onRequestDemo }) {
  return (
    <section id="contact" className={styles.section}>
      <div className={styles.inner}>
        <SectionLabel>Begin</SectionLabel>
        <h3 className={styles.heading}>
          AI isn't waiting for you to be ready. <em>Start now.</em>
        </h3>
        <div className={styles.actions}>
          <Button onClick={onRequestDemo} arrow>
            Start with a workflow assessment
          </Button>
        </div>
      </div>
    </section>
  );
}
