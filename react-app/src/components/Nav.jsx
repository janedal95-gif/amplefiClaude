import React from 'react';
import styles from './Nav.module.css';

function Nav({ onRequestDemo }) {
    return (
        <nav className={styles.nav}>
            <div className={styles.inner}>
                <a href="/" className={styles.wordmark}>
                    <img src="/AmplefiLogoTrans.png" alt="Amplefi" className={styles.logo} />
                </a>
                <button className={styles.cta} onClick={onRequestDemo}>
                    Start with an operational analysis
                </button>
            </div>
        </nav>
    );
}

export default Nav;
