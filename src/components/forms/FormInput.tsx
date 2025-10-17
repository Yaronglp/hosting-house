interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: string | number
  onChange: (value: string) => void
  testId?: string
}

export function FormInput({
  value,
  onChange,
  className = '',
  dir = 'rtl',
  testId,
  ...props
}: FormInputProps) {
  const baseClasses = 'px-4 py-2.5 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring padding-default'
  
  return (
    <input
      value={value.toString()}
      onChange={(e) => onChange(e.target.value)}
      dir={dir}
      className={`${baseClasses} ${className}`}
      data-cy={testId}
      {...props}
    />
  )
}
