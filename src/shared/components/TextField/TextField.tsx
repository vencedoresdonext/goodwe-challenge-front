import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react'
import { cn } from '../../utils/cn'
import styles from './TextField.module.css'

interface FieldShellProps {
  id: string
  label: string
  hint?: ReactNode
  error?: string
  children: ReactNode
  className?: string
}

function FieldShell({ id, label, hint, error, children, className }: FieldShellProps) {
  return (
    <div className={cn(styles.field, className)}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {children}
      {error ? (
        <small id={`${id}-message`} className={styles.error} role="alert">
          {error}
        </small>
      ) : (
        hint && (
          <small id={`${id}-message`} className={styles.hint}>
            {hint}
          </small>
        )
      )}
    </div>
  )
}

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: ReactNode
  error?: string
}

export function TextField({ label, hint, error, className, id, ...props }: TextFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  return (
    <FieldShell id={inputId} label={label} hint={hint} error={error} className={className}>
      <input
        id={inputId}
        className={cn(styles.input, error && styles.invalid)}
        aria-invalid={!!error || undefined}
        aria-describedby={error || hint ? `${inputId}-message` : undefined}
        {...props}
      />
    </FieldShell>
  )
}

export interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  hint?: ReactNode
  error?: string
  options: Array<{ value: string | number; label: string }>
  placeholder?: string
}

export function SelectField({ label, hint, error, options, placeholder, className, id, ...props }: SelectFieldProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  return (
    <FieldShell id={selectId} label={label} hint={hint} error={error} className={className}>
      <select
        id={selectId}
        className={cn(styles.input, styles.select, error && styles.invalid)}
        aria-invalid={!!error || undefined}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  )
}
