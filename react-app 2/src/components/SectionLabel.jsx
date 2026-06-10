import styles from './SectionLabel.module.css';

export default function SectionLabel({ children }) {
  return <p className={styles.label}>{children}</p>;
}
