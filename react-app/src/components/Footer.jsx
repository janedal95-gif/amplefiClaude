import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <img src="/AmplefiLogoTrans.png" alt="Amplefi" className={styles.logo} />
      <p>&copy; {new Date().getFullYear()} Amplefi</p>
    </footer>
  );
}
