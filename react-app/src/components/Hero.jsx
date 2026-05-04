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
          Small, unresolved issues slow teams down every day.
          Amplefi finds them — delays, broken handoffs, slow decisions — and removes them at the source.
        </p>
        <Button onClick={onRequestDemo} className={styles.cta}>Get an operational analysis</Button>
        <p className={styles.qualifier}>For teams tired of solving the same operational problems every week.</p>
      </div>
    </section>
  );
}