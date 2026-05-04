import styles from './Stats.module.css';

const stats = [
  {
    label: 'Engagement length',
    value: '6–12',
    unit: ' wk',
    detail: 'Short by design. We stay until the fix holds, then leave.',
  },
  {
    label: 'Deliverables',
    value: 'Zero',
    unit: ' decks',
    detail: 'No reports. No frameworks. The artifact is the changed process itself.',
  },
  {
    label: 'Practice',
    value: 'On the',
    unit: ' floor',
    detail: 'We work where the work happens, alongside the people doing it.',
  },
];

export default function Stats() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        {stats.map((s) => (
          <div key={s.label} className={styles.stat}>
            <span className={styles.label}>{s.label}</span>
            <div className={styles.value}>
              {s.value}<em>{s.unit}</em>
            </div>
            <p className={styles.detail}>{s.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
