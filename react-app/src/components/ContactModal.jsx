import { useEffect, useRef, useState } from 'react';
import { postLead } from '../lib/api';
import styles from './ContactModal.module.css';

export default function ContactModal({ open, onClose }) {
  const dialogRef = useRef(null);
  const firstInputRef = useRef(null);
  const triggerRef = useRef(null);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      setStatus('idle');
      requestAnimationFrame(() => firstInputRef.current?.focus());
    } else {
      document.body.style.overflow = '';
      triggerRef.current?.focus();
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    if (open) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  function handleBackdropClick(e) {
    if (e.target === dialogRef.current) onClose();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;

    if (form.company_website.value) return;

    setStatus('loading');

    try {
      await postLead({
        fullName: form.fullName.value.trim(),
        workEmail: form.workEmail.value.trim(),
        title: form.title.value.trim(),
        organization: form.organization.value.trim(),
        message: form.message.value.trim(),
      });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div
      className={styles.backdrop}
      ref={dialogRef}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Request a Demo"
    >
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose} aria-label="Close">
          &times;
        </button>

        {status === 'success' ? (
          <div className={styles.confirmation}>
            <h2 className={styles.heading}>Request a Demo</h2>
            <p className={styles.successMsg}>
              Thanks &mdash; we'll reach out shortly.
            </p>
          </div>
        ) : (
          <>
            <h2 className={styles.heading}>Request a Demo</h2>
            <p className={styles.subtext}>
              Tell us about your hospital. We'll follow up within two business days.
            </p>

            {status === 'error' && (
              <p className={styles.errorMsg}>Something went wrong. Try again.</p>
            )}

            <form className={styles.form} onSubmit={handleSubmit}>
              <input
                type="text"
                name="company_website"
                tabIndex={-1}
                autoComplete="off"
                className={styles.honeypot}
                aria-hidden="true"
              />

              <label className={styles.label} htmlFor="demo-fullName">
                Full name
              </label>
              <input
                className={styles.input}
                id="demo-fullName"
                name="fullName"
                type="text"
                required
                ref={firstInputRef}
                placeholder="Your full name"
                disabled={status === 'loading'}
              />

              <label className={styles.label} htmlFor="demo-workEmail">
                Work email
              </label>
              <input
                className={styles.input}
                id="demo-workEmail"
                name="workEmail"
                type="email"
                required
                placeholder="you@hospital.org"
                disabled={status === 'loading'}
              />

              <label className={styles.label} htmlFor="demo-title">
                Title
              </label>
              <input
                className={styles.input}
                id="demo-title"
                name="title"
                type="text"
                placeholder="e.g. Chief Nursing Officer"
                disabled={status === 'loading'}
              />

              <label className={styles.label} htmlFor="demo-organization">
                Organization
              </label>
              <input
                className={styles.input}
                id="demo-organization"
                name="organization"
                type="text"
                placeholder="Hospital or health system"
                disabled={status === 'loading'}
              />

              <label className={styles.label} htmlFor="demo-message">
                Message
              </label>
              <textarea
                className={styles.textarea}
                id="demo-message"
                name="message"
                rows={3}
                placeholder="What keeps you up at night about your operations?"
                disabled={status === 'loading'}
              />

              <button
                className={styles.submit}
                type="submit"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Submitting\u2026' : 'Submit'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
