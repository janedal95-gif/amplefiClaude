import styles from './Button.module.css';

export default function Button({ href, onClick, children, className }) {
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${styles.btn} ${className || ''}`}>
        {children}
      </button>
    );
  }

  return (
    <a href={href} className={`${styles.btn} ${className || ''}`}>
      {children}
    </a>
  );
}
