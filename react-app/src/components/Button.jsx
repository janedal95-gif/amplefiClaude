import styles from './Button.module.css';

export default function Button({ href, onClick, children, className, ghost, arrow }) {
  const cls = [styles.btn, ghost ? styles.ghost : '', className || ''].filter(Boolean).join(' ');
  const content = (
    <>
      {children}
      {arrow && <span className={styles.arrow} aria-hidden="true">→</span>}
    </>
  );

  if (onClick) {
    return <button type="button" onClick={onClick} className={cls}>{content}</button>;
  }
  return <a href={href} className={cls}>{content}</a>;
}
