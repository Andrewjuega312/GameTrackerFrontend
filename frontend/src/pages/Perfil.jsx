import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import api from '../api/axios'
import TarjetaJuego from '../components/TarjetaJuego'

function Perfil() {
  const { user } = useContext(AuthContext)
  const [favoritos, setFavoritos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const cargar = async () => {
      try {
        const r = await api.get('/api/favoritos')
        setFavoritos(r.data)
        setCargando(false)
      } catch (e) {
        setError('No se pudieron cargar tus favoritos')
        setCargando(false)
      }
    }
    if (user) cargar(); else setCargando(false)
  }, [user])

  if (!user) return <div className="error">Debes iniciar sesión para ver Mis Favoritos</div>
  if (cargando) return <div className="cargando">Cargando favoritos...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="contenido">
      <h2>Mis Favoritos</h2>
      {favoritos.length === 0 ? (
        <p>No tienes favoritos</p>
      ) : (
        <div className="grid-juegos">
          {favoritos.map(j => (
            <TarjetaJuego key={j._id} juego={j} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Perfil