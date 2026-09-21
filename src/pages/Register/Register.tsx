import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Logo from '../../components/Logo/Logo.js'
import Button from '../../components/Button/Button.tsx'
import style from './style.module.css'
import { register } from '../../services/domains/auth.ts'
import { tokenStorage } from '../../services/api.ts'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }))

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const tokens = await register(form)
      tokenStorage.set(tokens)
      navigate('/inicio')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={style['cadastro-page']}>
      <div className={style['cadastro-logo']}>
        <Logo />
      </div>

      <h1 className={style['cadastro-title']}>Cadastro</h1>

      <form className={style['cadastro-form']} onSubmit={handleSubmit}>
        <div className={style['cadastro-field']}>
          <input
            className={style['cadastro-field__input']}
            type="text"
            placeholder="Nome completo"
            aria-label="Nome completo"
            autoComplete="name"
            value={form.fullName}
            onChange={set('fullName')}
            required
          />
        </div>

        <div className={style['cadastro-field']}>
          <input
            className={style['cadastro-field__input']}
            type="email"
            placeholder="Email"
            aria-label="Email"
            autoComplete="email"
            value={form.email}
            onChange={set('email')}
            required
          />
        </div>

        <div className={style['cadastro-field']}>
          <input
            className={style['cadastro-field__input']}
            type="tel"
            placeholder="Telefone com DDD (+5511999999999)"
            aria-label="Telefone"
            autoComplete="tel"
            value={form.phone}
            onChange={set('phone')}
            required
          />
        </div>

        <div className={style['cadastro-field']}>
          <input
            className={style['cadastro-field__input']}
            type="password"
            placeholder="Senha"
            aria-label="Senha"
            autoComplete="new-password"
            value={form.password}
            onChange={set('password')}
            required
          />
          <small className={style['cadastro-hint']}>
            Mín. 8 caracteres, com maiúscula, minúscula, número e símbolo.
          </small>
        </div>

        {error && (
          <p className={style['cadastro-error']} role="alert">
            {error}
          </p>
        )}

        <Button type="submit">
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </Button>
      </form>

      <p className={style['cadastro-link']}>
        Já tem uma conta? Faça <Link to="/login">Login</Link>
      </p>
    </div>
  )
}
