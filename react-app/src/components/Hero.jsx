import Button from './Button';
import styles from './Hero.module.css';

export default function Hero({ onRequestDemo }) {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay} />
      <div className={styles.inner}>
        <h1 className={styles.headline}>
          Fix the recurring problems your team has learned to live with.
        </h1>
        <p className={styles.subline}>
          Amplefi goes into your operations, finds the friction points slowing
          your team down — delays, broken handoffs, slow decisions — and removes them.
        </p>
        <Button onClick={onRequestDemo} className={styles.cta}>Let’s have a coffee?</Button>
      </div>
    </section>
  );
}