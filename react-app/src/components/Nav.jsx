import React from 'react';
import styles from './Nav.module.css';

function Nav({ onRequestDemo }) {
    return (
        <nav className={styles.nav}>
            <div className={styles.inner}>
                <a href="/" className={styles.wordmark}>
                    Amplefi
                </a>
                <button className={styles.cta} onClick={onRequestDemo}>
                    Start with an operational analysis
                </button>
            </div>
        </nav>
    );
}

export default Nav;
