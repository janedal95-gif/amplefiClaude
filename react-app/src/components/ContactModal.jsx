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
      aria-label="Start with a Workflow Assessment"
    >
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose} aria-label="Close">
          &times;
        </button>

        {status === 'success' ? (
          <div className={styles.confirmation}>
            <h4 className={styles.heading}>Received.</h4>
            <p className={styles.subtext}>We'll be in touch within two business days.</p>
          </div>
        ) : (
          <>
            <h4 className={styles.heading}>Start your <em>Workflow Assessment.</em></h4>
            <p className={styles.subtext}>
              Tell us briefly where the drag is. We'll respond within two business days.
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

              <div className={styles.field}>
                <label className={styles.label} htmlFor="modal-name">Name</label>
                <input
                  className={styles.input}
                  id="modal-name"
                  name="fullName"
                  type="text"
                  required
                  ref={firstInputRef}
                  disabled={status === 'loading'}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="modal-email">Email</label>
                <input
                  className={styles.input}
                  id="modal-email"
                  name="workEmail"
                  type="email"
                  required
                  disabled={status === 'loading'}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="modal-org">Company</label>
                <input
                  className={styles.input}
                  id="modal-org"
                  name="organization"
                  type="text"
                  disabled={status === 'loading'}
                />
              </div>

              <input type="hidden" name="title" value="" />

              <div className={styles.field}>
                <label className={styles.label} htmlFor="modal-msg">Where is the recurring problem?</label>
                <textarea
                  className={styles.textarea}
                  id="modal-msg"
                  name="message"
                  rows={3}
                  disabled={status === 'loading'}
                />
              </div>

              <div className={styles.footer}>
                <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                <button
                  className={styles.submit}
                  type="submit"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? 'Sending…' : 'Send request →'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
