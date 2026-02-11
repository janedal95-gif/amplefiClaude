import { useState } from 'react';
import { postSubscribe } from '../lib/api';
import styles from './Footer.module.css';

export default function Footer() {
  const [status, setStatus] = useState('idle');

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;

    if (form.company_website.value) return;

    setStatus('loading');

    try {
      await postSubscribe({
        email: form.email.value.trim(),
      });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    <footer className={styles.footer}>
      <img src="/amplefiLogoTransparent.png" alt="Amplefi" className={styles.logo} />

      {status === 'success' ? (
        <p className={styles.subscribeSuccess}>You're subscribed.</p>
      ) : (
        <>
          <form className={styles.subscribeForm} onSubmit={handleSubmit}>
            <input
              type="text"
              name="company_website"
              tabIndex={-1}
              autoComplete="off"
              className={styles.honeypot}
              aria-hidden="true"
            />
            <input
              className={styles.emailInput}
              name="email"
              type="email"
              required
              placeholder="Your email"
              disabled={status === 'loading'}
            />
            <button
              className={styles.subscribeBtn}
              type="submit"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Subscribing\u2026' : 'Subscribe'}
            </button>
          </form>
          {status === 'error' && (
            <p className={styles.subscribeError}>Something went wrong. Try again.</p>
          )}
        </>
      )}

      <p>&copy; {new Date().getFullYear()} Amplefi</p>
    </footer>
  );
}
