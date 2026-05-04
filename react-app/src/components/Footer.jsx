import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <a href="#" className={styles.brand} aria-label="Amplefi">
            <img src="/amplefi-logo-ink.png" alt="Amplefi" className={styles.logo} />
          </a>
          <div className={styles.links}>
            <a href="#what">What we do</a>
            <a href="#how">Approach</a>
            <a href="#why">Why it works</a>
            <a href="mailto:hello@amplefi.com">Contact</a>
          </div>
        </div>
        <div className={styles.big}>Fewer <em>problems.</em></div>
        <div className={styles.bottom}>
          <div className={styles.colophon}>
            &copy; {new Date().getFullYear()} AMPLEFI LLC<br />
            OPERATIONAL DIAGNOSTICS &amp; REMEDIATION
          </div>
          <div className={`${styles.colophon} ${styles.right}`}>
            NEW YORK / REMOTE<br />
            HELLO@AMPLEFI.COM
          </div>
        </div>
      </div>
    </footer>
  );
}
