// Página de inicio de sesión; usa el contexto para autenticar y redirigir.
import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import '../styles/FormularioJuego.css'

function Login() {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // Maneja envío del formulario y muestra errores de credenciales.
  const onSubmit = async e => {
    e.preventDefault()
    try {
      await login(email, password)
      navigate('/')    }
       catch (e) {
      setError('Credenciales inválidas')
    }
  }

  return (
    <div className="formulario-container">
      <h2>Iniciar sesión</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={onSubmit} className="formulario-juego">
        <div className="campo">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="campo">
          <label htmlFor="password">Contraseña</label>
          <input id="password" type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="btn-guardar">Entrar</button>
      </form>
    </div>
  )
}

export default Login