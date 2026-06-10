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
          <span className={styles.metaLabel}>Operational implementation for experienced professionals</span>
        </div>
        <div>
          <h1 className={styles.headline}>
            AI is getting forced into how you work.<br />
            <em>Most of what you've built isn't ready for it.</em>
          </h1>
          <p className={styles.subline}>
            Amplefi gets your house in order now — so when that moment comes, it's an upgrade, not a rebuild.
          </p>
          <div className={styles.actions}>
            <Button onClick={onRequestDemo} arrow className={styles.heroCta}>
              Start with a Workflow Assessment
            </Button>
            <Button href="#how" ghost className={styles.heroGhost}>
              Read our approach
            </Button>
          </div>
          <p className={styles.qualifier}>
            For mid-to-late career professionals who built something real and want to keep it that way.
          </p>
        </div>
      </div>
    </header>
  );
}
