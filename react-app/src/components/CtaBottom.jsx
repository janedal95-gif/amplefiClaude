import Button from './Button';
import styles from './CtaBottom.module.css';

export default function CtaBottom({ onRequestDemo }) {
  return (
    <section className={styles.section}>
      <p className={styles.text}>
        Better operations don't require more tools or bigger processes. They
        require removing what's actually slowing you down.
      </p>
      <Button onClick={onRequestDemo}>
        Let’s have a coffee?
      </Button>
    </section>
  );
}