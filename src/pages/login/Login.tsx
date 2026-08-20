import style from './style.module.css'
import Logo from '../../components/Logo/Logo'

export default function Login() {

  return (
    <div className={style.contentLogin}>
      <div className={style.logo}>
        <Logo/>
      </div>

      <div className={style.formLogin}>
        <h1>Login</h1>
        <div className={style.inputsLogin}>
          <input type="text" />
          <input type="password" />
        </div>
        <button>Entrar</button>
      </div>

      <p>Não tem uma conta? <a href="">Clique aqui</a> e faça o cadastro!</p>
    </div>
  )
}
