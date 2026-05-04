import Button from './Button';
import styles from './CtaBottom.module.css';

export default function CtaBottom({ onRequestDemo }) {
  return (
    <section className={styles.section}>
      <p className={styles.text}>
        Better operations don’t come from adding more.<br />
        They come from removing what shouldn’t be there.
      </p>
      <Button onClick={onRequestDemo}>
        Get an operational analysis
      </Button>
    </section>
  );
}