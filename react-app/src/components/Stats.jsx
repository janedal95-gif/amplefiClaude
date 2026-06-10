import styles from './Stats.module.css';

const stats = [
  {
    label: 'The promise',
    value: 'Upgrade,',
    unit: ' not rebuild',
    detail: 'When AI gets forced into how you work, your systems absorb it. Not the other way around.',
  },
  {
    label: 'Our method',
    value: 'Done',
    unit: ' with you',
    detail: 'Jane spends a week on the floor learning your real process. We implement alongside you until it runs.',
  },
  {
    label: 'What you keep',
    value: 'Full',
    unit: ' ownership',
    detail: 'You run it. You understand it. No dependency on us to keep it working.',
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
