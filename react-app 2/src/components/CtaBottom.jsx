import Button from './Button';
import styles from './CtaBottom.module.css';

export default function CtaBottom({ onRequestDemo }) {
  return (
    <section className={styles.section}>
      <p className={styles.text}>
        Better operations come from fewer problems.
      </p>
      <Button onClick={onRequestDemo}>
        Get an operational analysis
      </Button>
    </section>
  );
}