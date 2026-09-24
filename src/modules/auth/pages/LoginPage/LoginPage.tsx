import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { paths } from '../../../../app/router/paths'
import { getErrorMessage } from '../../../../lib/http'
import { Button, InlineError, TextField } from '../../../../shared/components'
import { useDocumentTitle } from '../../../../shared/hooks'
import { AuthLayout } from '../../components/AuthLayout/AuthLayout'
import { useAuth } from '../../hooks/useAuth'
import styles from '../auth-form.module.css'

export function LoginPage() {
  useDocumentTitle('Entrar')
  const { login, sessionExpired } = useAuth()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!identifier.trim() || !password) {
      setError('Informe seu email (ou telefone) e sua senha.')
      return
    }
    setError(null)
    setLoading(true)
    try {
      await login({ identifier: identifier.trim(), password })
    } catch (err) {
      setError(getErrorMessage(err))
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Login"
      footer={
        <>
          Ainda não tem conta? <Link to={paths.register}>Cadastre-se</Link>
        </>
      }
    >
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {sessionExpired && <p className={styles.notice}>Sua sessão expirou. Entre novamente para continuar.</p>}
        <TextField
          label="Email ou telefone"
          autoComplete="username"
          placeholder="voce@empresa.com ou +5511999999999"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
        <TextField
          label="Senha"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <InlineError message={error} />
        <Button type="submit" size="lg" block loading={loading}>
          Entrar
        </Button>
      </form>
    </AuthLayout>
  )
}
