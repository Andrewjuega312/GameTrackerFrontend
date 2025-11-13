// Página de registro de cuenta; valida y crea usuario con el backend.
import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import '../styles/FormularioJuego.css'

function Registro() {
  const { register } = useContext(AuthContext)
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  // Envía el formulario, valida longitud de contraseña y maneja respuesta.
  const onSubmit = async e => {
    e.preventDefault()
    if (password.length < 6) return setError('Contraseña muy corta')
    try {
      await register(nombre, email, password)
      navigate('/')
    } catch (e) {
      setError('No se pudo registrar')
    }
  }

  return (
    <div className="formulario-container">
      <h2>Registro</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={onSubmit} className="formulario-juego">
        <div className="campo">
          <label htmlFor="nombre">Nombre</label>
          <input id="nombre" type="text" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
        </div>
        <div className="campo">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="campo">
          <label htmlFor="password">Contraseña</label>
          <input id="password" type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="btn-guardar">Crear cuenta</button>
      </form>
    </div>
  )
}

export default Registro