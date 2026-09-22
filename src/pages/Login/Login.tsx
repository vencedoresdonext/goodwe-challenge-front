import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import style from './style.module.css'
import Logo from '../../components/Logo/Logo'
// import { login } from '../../services/domains/auth' // TEMP: login via API desativado
// import { tokenStorage } from '../../services/api' // TEMP: não guarda token, pois auth está desativada

export default function Login() {
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // TEMP: fluxo de login/registro desativado.
  // Ao clicar em "Entrar" vai direto para a tela inicial (/places),
  // sem chamar a API de autenticação.
  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(false)
    navigate('/places')

    /* Lógica original (restaurar quando o login voltar a ser usado):
    setLoading(true)
    try {
      const tokens = await login(identifier, password)
      tokenStorage.set(tokens)
      navigate('/places')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao entrar')
    } finally {
      setLoading(false)
    }
    */
  }

  return (
    <div className={style.contentLogin}>
      <div className={style.logo}>
        <Logo />
      </div>

      <form className={style.formLogin} onSubmit={handleSubmit}>
        <h1>Login</h1>

        <div className={style.inputsLogin}>
          <input
            type="text"
            placeholder="Email ou telefone"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            // required removido: TEMP, tela liberada sem preencher/logar de fato
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            // required removido: TEMP, tela liberada sem preencher/logar de fato
          />
        </div>

        {error && <p role="alert">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        <p>Não tem uma conta? <Link to="/register">Clique aqui</Link> e faça o cadastro!</p>
      </form>
    </div>
  )
}
