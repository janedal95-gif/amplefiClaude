import Button from './Button';
import styles from './Hero.module.css';

export default function Hero({ onRequestDemo }) {
  return (
    <header className={styles.hero}>
      <div className={styles.bg} aria-hidden="true">
        <img src="/amplefi-water.jpeg" alt="" />
      </div>
      <div className={styles.shell}>
        <div className={styles.meta}>
          <span className={styles.metaLabel}>Operational diagnostics &amp; remediation</span>
          <span className={styles.metaLabel}>Est. 2024 — New York</span>
        </div>
        <div>
          <h1 className={styles.headline}>
            Fix the problems your team has <em>learned</em> to work around.
          </h1>
          <p className={styles.subline}>
            Small, unresolved issues slow teams down every day. Amplefi finds them — delays, broken handoffs, slow decisions — and removes them at the source.
          </p>
          <div className={styles.actions}>
            <Button onClick={onRequestDemo} arrow className={styles.heroCta}>
              Get an operational analysis
            </Button>
            <Button href="#how" ghost className={styles.heroGhost}>
              Read our approach
            </Button>
          </div>
          <p className={styles.qualifier}>
            For teams tired of solving the same operational problems every week.
          </p>
        </div>
      </div>
      <span className={styles.plateCaption}>Surface tension</span>
    </header>
  );
}
