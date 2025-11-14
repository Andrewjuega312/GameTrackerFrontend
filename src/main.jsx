// Punto de entrada del frontend.
// Aquí definimos estilos globales, configuramos Axios y envolvemos la app con los "contextos".
import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import axios from 'axios'
import { TemaProvider } from './context/TemaContext'
import { AuthProvider } from './context/AuthContext'

// Dirección base de la API. Si existe una variable de entorno VITE_API_URL, la usamos; si no, localhost.
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Formato de las peticiones y envío de cookies (por si el servidor las usa).
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.withCredentials = true

// Este interceptor captura errores de la API y muestra mensajes amigables en la consola.
axios.interceptors.response.use(
  response => response,
  error => {
    console.error('Error en petición API:', error.response?.data || error.message)
    if (error.response?.status === 404) {
      console.error('Recurso no encontrado')
    } else if (error.response?.status === 500) {
      console.error('Error del servidor')
    } else if (!error.response) {
      console.error('Error de red - No se pudo conectar al servidor')
    }
    return Promise.reject(error)
  }
)

// Renderizamos la aplicación dentro de StrictMode (ayuda a detectar problemas) y
// envolvemos con TemaProvider (modo claro/oscuro) y AuthProvider (login/registro).
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TemaProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </TemaProvider>
  </StrictMode>,
)
