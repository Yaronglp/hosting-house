interface FormInputProps {
  id: string
  type?: string
  value: string | number
  onChange: (value: string) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
  className?: string
  dir?: 'rtl' | 'ltr'
  testId?: string
}

export function FormInput({
  id,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  required,
  className = '',
  dir = 'rtl',
  testId
}: FormInputProps) {
  const baseClasses = 'px-4 py-2.5 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring padding-default'
  
  return (
    <input
      id={id}
      type={type}
      value={value.toString()}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      required={required}
      dir={dir}
      className={`${baseClasses} ${className}`}
      data-cy={testId}
    />
  )
}
