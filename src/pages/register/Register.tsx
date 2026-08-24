import { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
import Logo from '../../components/Logo/Logo.js'
import Button from '../../components/Button/Button.tsx'
import style from './style.module.css'

export default function Register() {
  const [username, setUsername] = useState('')
  const [login, setLogin] = useState('')
  // const navigate = useNavigate()

  // function handleSubmit(e) {
  //   e.preventDefault()
  //   // Front-end apenas: sem integração com backend por enquanto.
  //   console.log({ username, login })
  //   navigate('/inicio')
  // }

  return (
    <div className={style['cadastro-page']}>
      <Logo />

      <h1 className={style['cadastro-title']}>Cadastro</h1>

      <form className={style['cadastro-form']}>
        <div className={style['cadastro-field']}>
          <label htmlFor="username" className={style['cadastro-field__label cadastro-field__label--username']}>
          </label>
          <input
            id="username"
            type="text"
            className={`${style['cadastro-field__input']} ${style['cadastro-field__input--login']}`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Digite seu usuário"
          />
        </div>

        <div className={style['cadastro-field']}>
          <label htmlFor="login" className={`${style['cadastro-field__label']} ${style['cadastro-field__label--login']}`}>
          </label>
          <input
            id="login"
            type="password"
            className={`${style['cadastro-field__input']} ${style['cadastro-field__input--login']}`}
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Digite sua senha"
          />
        </div>

        <Button type="submit">login</Button>
      </form>

      <p className={style['cadastro-link']}>
        Já tem uma conta? Faça <a href="/login" className="cadastro-link__action">Login</a>
      </p>
    </div>
  )
}