// Contexto de Autenticación
// Explicación sencilla:
// - Guarda el usuario y el token de acceso.
// - Expone funciones para login, registro y logout.
// - Configura axios para enviar el token en cada petición.
import React, { createContext, useState, useEffect } from 'react'
import api from '../api/axios'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  // Estado inicial: intentamos recuperar token/usuario de localStorage.
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user')
    return u ? JSON.parse(u) : null
  })

  // Cuando cambia el token, lo añadimos o quitamos de las cabeceras por defecto.
  useEffect(() => {
    if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    else delete api.defaults.headers.common['Authorization']
  }, [token])

  // Iniciar sesión: pedimos a la API y guardamos token y usuario.
  const login = async (email, password) => {
    const r = await api.post('/api/auth/login', { email, password })
    setToken(r.data.token)
    setUser(r.data.usuario)
    localStorage.setItem('token', r.data.token)
    localStorage.setItem('user', JSON.stringify(r.data.usuario))
  }

  // Registrarse: similar al login, pero crea el usuario primero.
  const register = async (nombre, email, password) => {
    const r = await api.post('/api/auth/register', { nombre, email, password })
    setToken(r.data.token)
    setUser(r.data.usuario)
    localStorage.setItem('token', r.data.token)
    localStorage.setItem('user', JSON.stringify(r.data.usuario))
  }

  // Cerrar sesión: limpiamos token y usuario del estado y localStorage.
  const logout = () => {
    setToken('')
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    // Proveedor: comparte token, usuario y funciones de auth con toda la app.
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}