import Button from './Button';
import styles from './CtaBottom.module.css';

export default function CtaBottom({ onRequestDemo }) {
  return (
    <section className={styles.section}>
      <p className={styles.text}>
        Better operations come from better execution, not more tools. Start with
        an operational analysis.
      </p>
      <Button onClick={onRequestDemo}>
        Request a Demo
      </Button>
    </section>
  );
}
