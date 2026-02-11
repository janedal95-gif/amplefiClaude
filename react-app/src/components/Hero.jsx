import Button from './Button';
import styles from './Hero.module.css';

export default function Hero({ onRequestDemo }) {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay} />
      <div className={styles.inner}>
        <h1 className={styles.headline}>
          Run your hospital ahead of demand, not behind it.
        </h1>
        <p className={styles.subline}>
          Real-time coordination for the floor, the shift, and the decisions that
          keep patients moving and staff focused.
        </p>
        <Button onClick={onRequestDemo} className={styles.cta}>Request a Demo</Button>
      </div>
    </section>
  );
}
