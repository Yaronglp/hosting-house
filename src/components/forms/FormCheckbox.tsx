interface FormCheckboxProps {
  id: string
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  className?: string
  testId?: string
}

export function FormCheckbox({ id, checked, onChange, label, className = '', testId }: FormCheckboxProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded"
        data-cy={testId}
      />
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
    </div>
  )
}
