import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <a href="#" className={styles.brand} aria-label="Amplefi">
            <img src="/amplefi-logo-ink.png" alt="Amplefi" className={styles.logo} />
          </a>
        </div>
      </div>
    </footer>
  );
}
