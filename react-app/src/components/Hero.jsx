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
            AI is getting forced into how you work. We make sure your systems are ready for it.
          </h1>
          <p className={styles.subline}>
            Amplefi builds the operational playbook experienced professionals need — so when that moment comes, it's an upgrade, not a rebuild.
          </p>
          <div className={styles.actions}>
            <Button onClick={onRequestDemo} arrow className={styles.heroCta}>
              Start with a workflow assessment
            </Button>
            <Button href="#how" ghost className={styles.heroGhost}>
              Read our approach
            </Button>
          </div>
          <p className={styles.qualifier}>
            For professionals who want to be ready before AI forces their hand.
          </p>
        </div>
      </div>
      <span className={styles.plateCaption}>Surface tension</span>
    </header>
  );
}
