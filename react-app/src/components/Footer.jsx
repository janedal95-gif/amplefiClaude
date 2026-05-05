import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <a href="#" className={styles.brand} aria-label="Amplefi">
            <img src="/amplefi-logo-ink.png" alt="Amplefi" className={styles.logo} />
          </a>
          <p className={styles.copy}>&copy; {new Date().getFullYear()} Amplefi LLC</p>
        </div>
      </div>
    </footer>
  );
}
