import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { paths } from '../../../../app/router/paths'
import { getErrorMessage } from '../../../../lib/http'
import { Button, InlineError, TextField } from '../../../../shared/components'
import { useDocumentTitle } from '../../../../shared/hooks'
import { isEmail, isPhone, normalizePhone, passwordIssues } from '../../../../shared/utils'
import { AuthLayout } from '../../components/AuthLayout/AuthLayout'
import { useAuth } from '../../hooks/useAuth'
import styles from '../auth-form.module.css'

type Form = { fullName: string; email: string; phone: string; password: string; confirmPassword: string }
type Errors = Partial<Record<keyof Form, string>>

function validate(form: Form): Errors {
  const errors: Errors = {}
  if (!form.fullName.trim()) errors.fullName = 'Informe seu nome completo.'
  if (!isEmail(form.email)) errors.email = 'Informe um email válido.'
  if (!isPhone(form.phone)) errors.phone = 'Use o formato com DDI e DDD, ex.: +5511999999999.'
  const issues = passwordIssues(form.password)
  if (issues.length) errors.password = `A senha precisa de: ${issues.join(', ')}.`
  if (form.confirmPassword !== form.password) errors.confirmPassword = 'As senhas não coincidem.'
  return errors
}

export function RegisterPage() {
  useDocumentTitle('Cadastro')
  const { register } = useAuth()
  const [form, setForm] = useState<Form>({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const bind = (field: keyof Form) => ({
    value: form[field],
    error: errors[field],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setForm((prev) => ({ ...prev, [field]: e.target.value })),
  })

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const validation = validate(form)
    setErrors(validation)
    if (Object.keys(validation).length) return

    setError(null)
    setLoading(true)
    try {
      await register({
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: normalizePhone(form.phone),
        password: form.password,
      })
    } catch (err) {
      setError(getErrorMessage(err))
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Cadastro"
      footer={
        <>
          Já tem conta? <Link to={paths.login}>Entrar</Link>
        </>
      }
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <TextField label="Nome completo" autoComplete="name" {...bind('fullName')} />
        <TextField label="Email" type="email" autoComplete="email" {...bind('email')} />
        <TextField
          label="Telefone"
          type="tel"
          autoComplete="tel"
          placeholder="+5511999999999"
          {...bind('phone')}
        />
        <TextField
          label="Senha"
          type="password"
          autoComplete="new-password"
          hint="Mínimo de 8 caracteres, com maiúscula, minúscula, número e símbolo."
          {...bind('password')}
        />
        <TextField label="Confirme a senha" type="password" autoComplete="new-password" {...bind('confirmPassword')} />
        <InlineError message={error} />
        <Button type="submit" size="lg" block loading={loading}>
          Criar conta
        </Button>
      </form>
    </AuthLayout>
  )
}
