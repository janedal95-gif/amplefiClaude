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
        <div className={styles.bottom}>
          <div className={styles.colophon}>
            &copy; {new Date().getFullYear()} AMPLEFI LLC<br />
            OPERATIONAL DIAGNOSTICS &amp; REMEDIATION
          </div>
          <div className={`${styles.colophon} ${styles.right}`}>
            TAMPA, FLORIDA<br />
            HELLO@AMPLEFI.COM
          </div>
        </div>
      </div>
    </footer>
  );
}
