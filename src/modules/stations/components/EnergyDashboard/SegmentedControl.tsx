import { useId } from 'react'
import styles from './EnergyDashboard.module.css'

interface SegmentedControlProps<T extends string> {
  label: string
  value: T
  options: Array<{ value: T; label: string }>
  onChange: (value: T) => void
}

export function SegmentedControl<T extends string>({ label, value, options, onChange }: SegmentedControlProps<T>) {
  const name = useId()
  return (
    <div role="radiogroup" aria-label={label} className={styles.segmented}>
      {options.map((option) => (
        <label key={option.value} className={styles.segment}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </div>
  )
}
