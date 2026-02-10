import styles from './Nav.module.css';

export default function Nav({ onRequestDemo }) {
  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <a href="/" className={styles.wordmark}>Amplefi</a>
        <button type="button" className={styles.cta} onClick={onRequestDemo}>
          Request a Demo
        </button>
      </div>
    </nav>
  );
}
