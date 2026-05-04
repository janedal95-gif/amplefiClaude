import React from 'react';
import styles from './Nav.module.css';

function Nav({ onRequestDemo }) {
  return (
    <nav className={styles.nav}>
      <div className={styles.row}>
        <a href="#" className={styles.brand} aria-label="Amplefi">
          <img src="/amplefi-logo-ink.png" alt="Amplefi" className={styles.logo} />
        </a>
        <div className={styles.links}>
          <a href="#what">What we do</a>
          <a href="#how">Approach</a>
          <a href="#why">Why it works</a>
          <a href="#contact">Contact</a>
        </div>
        <button className={styles.cta} onClick={onRequestDemo}>
          Request analysis
        </button>
      </div>
    </nav>
  );
}

export default Nav;
