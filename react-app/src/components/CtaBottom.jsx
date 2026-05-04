import Button from './Button';
import SectionLabel from './SectionLabel';
import styles from './CtaBottom.module.css';

export default function CtaBottom({ onRequestDemo }) {
  return (
    <section id="contact" className={styles.section}>
      <div className={styles.inner}>
        <SectionLabel>Begin</SectionLabel>
        <h3 className={styles.heading}>
          Better operations come from <em>fewer problems.</em>
        </h3>
        <div className={styles.actions}>
          <Button onClick={onRequestDemo} arrow>
            Get an operational analysis
          </Button>
          <Button href="mailto:hello@amplefi.com" ghost>
            hello@amplefi.com
          </Button>
        </div>
      </div>
    </section>
  );
}
