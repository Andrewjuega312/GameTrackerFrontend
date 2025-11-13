// Este contexto gestiona todo lo relacionado con autenticación (login, registro y logout).
// Piensa en esto como la "caja" donde guardamos el usuario y su token.
import React, { createContext, useState, useEffect } from 'react'
import api from '../api/axios'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  // Guardamos el token y el usuario. Si ya estaban en localStorage, los usamos.
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user')
    return u ? JSON.parse(u) : null
  })

  // Si el token cambia, lo añadimos (o quitamos) de las cabeceras por defecto.
  useEffect(() => {
    if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    else delete api.defaults.headers.common['Authorization']
  }, [token])

  // Iniciar sesión: pedimos a la API, guardamos token y usuario.
  const login = async (email, password) => {
    const r = await api.post('/api/auth/login', { email, password })
    setToken(r.data.token)
    setUser(r.data.usuario)
    localStorage.setItem('token', r.data.token)
    localStorage.setItem('user', JSON.stringify(r.data.usuario))
  }

  // Registrarse: muy parecido al login, pero creando el usuario primero.
  const register = async (nombre, email, password) => {
    const r = await api.post('/api/auth/register', { nombre, email, password })
    setToken(r.data.token)
    setUser(r.data.usuario)
    localStorage.setItem('token', r.data.token)
    localStorage.setItem('user', JSON.stringify(r.data.usuario))
  }

  // Cerrar sesión: limpiamos token y usuario.
  const logout = () => {
    setToken('')
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    // Exponemos a toda la app estas funciones y datos.
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}