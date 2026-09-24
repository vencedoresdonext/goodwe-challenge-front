export const onlyDigits = (value: string) => value.replace(/\D/g, '')

export const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())

// Mesmas regras do @IsStrongPassword do back
export function passwordIssues(value: string): string[] {
  const issues: string[] = []
  if (value.length < 8) issues.push('mínimo de 8 caracteres')
  if (!/[a-z]/.test(value)) issues.push('uma letra minúscula')
  if (!/[A-Z]/.test(value)) issues.push('uma letra maiúscula')
  if (!/\d/.test(value)) issues.push('um número')
  if (!/[^A-Za-z0-9]/.test(value)) issues.push('um caractere especial')
  return issues
}

export const isStrongPassword = (value: string) => passwordIssues(value).length === 0

// telefone no formato internacional usado pelo back: +5511999999999
export const isPhone = (value: string) => /^\+?\d{10,15}$/.test(value.replace(/[\s()-]/g, ''))

export const normalizePhone = (value: string) => {
  const digits = onlyDigits(value)
  return digits ? `+${digits}` : ''
}

// algoritmo para o numero do cartao
export function isCardNumber(value: string) {
  const digits = onlyDigits(value)
  if (digits.length < 13 || digits.length > 19) return false
  let sum = 0
  let double = false
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let digit = Number(digits[i])
    if (double) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    double = !double
  }
  return sum % 10 === 0
}

export function isCpf(value: string) {
  const cpf = onlyDigits(value)
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false
  const calc = (length: number) => {
    let sum = 0
    for (let i = 0; i < length; i += 1) sum += Number(cpf[i]) * (length + 1 - i)
    const rest = (sum * 10) % 11
    return rest === 10 ? 0 : rest
  }
  return calc(9) === Number(cpf[9]) && calc(10) === Number(cpf[10])
}

export const isCnpj = (value: string) => onlyDigits(value).length === 14

export const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
