import { useEffect, useRef } from 'react';
import styles from './ContactModal.module.css';

export default function ContactModal({ open, onClose }) {
  const dialogRef = useRef(null);
  const nameRef = useRef(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      nameRef.current?.focus();
    } else {
      document.body.style.overflow = '';
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

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const position = form.position.value.trim();
    const worry = form.worry.value.trim();

    const subject = encodeURIComponent(`Demo Request — ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nPosition: ${position}\n\nBiggest Worry:\n${worry}`
    );

    window.location.href = `mailto:jane.dalesandro@amplefi.com?subject=${subject}&body=${body}`;
    onClose();
  }

  return (
    <div className={styles.backdrop} ref={dialogRef} onClick={handleBackdropClick} role="dialog" aria-modal="true" aria-label="Request a Demo">
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose} aria-label="Close">
          &times;
        </button>

        <h2 className={styles.heading}>Request a Demo</h2>
        <p className={styles.subtext}>
          Tell us about your hospital. We'll follow up within two business days.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor="demo-name">Name</label>
          <input
            className={styles.input}
            id="demo-name"
            name="name"
            type="text"
            required
            ref={nameRef}
            placeholder="Your full name"
          />

          <label className={styles.label} htmlFor="demo-position">Position</label>
          <input
            className={styles.input}
            id="demo-position"
            name="position"
            type="text"
            required
            placeholder="e.g. Chief Nursing Officer"
          />

          <label className={styles.label} htmlFor="demo-worry">
            Explain your biggest worry
          </label>
          <textarea
            className={styles.textarea}
            id="demo-worry"
            name="worry"
            rows={4}
            required
            placeholder="What keeps you up at night about your operations?"
          />

          <button className={styles.submit} type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
