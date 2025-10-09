import { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  required?: boolean
  children: ReactNode
  className?: string
}

export function FormField({ label, required, children, className = '' }: FormFieldProps) {
  return (
    <div className={`mb-4 ${className} padding-vertical-default`}>
      <label className="block text-sm font-medium mb-2">
        {label} {required && '*'}
      </label>
      {children}
    </div>
  )
}
