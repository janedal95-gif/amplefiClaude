import Button from './Button';
import styles from './Hero.module.css';

export default function Hero({ onRequestDemo }) {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay} />
      <div className={styles.inner}>
        <h1 className={styles.headline}>
          Fix the problems your team has learned to work around.
        </h1>
        <p className={styles.subline}>
          Small issues that never get resolved slow teams down every day.
          Amplefi finds them — delays, broken handoffs, slow decisions — and removes them.
        </p>
        <Button onClick={onRequestDemo} className={styles.cta}>Start with an operational analysis</Button>
      </div>
    </section>
  );
}