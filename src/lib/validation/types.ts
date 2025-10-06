export interface ValidationError {
  type: 'blocking' | 'warning'
  code: string
  message: string
  count?: number
  details?: string[]
}

export interface ValidationResult {
  errors: ValidationError[]
  warnings: ValidationError[]
  isValid: boolean
}
