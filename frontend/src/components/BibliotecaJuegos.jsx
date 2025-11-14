// Esta vista muestra tu biblioteca de juegos y permite filtrarlos.
// Aquí cargamos los juegos desde la API y aplicamos filtros simples.
import React, { useState, useEffect, useContext } from 'react'
import api from '../api/axios'
import TarjetaJuego from './TarjetaJuego'
import Filtros from './Filtros'
import '../styles/BibliotecaJuegos.css'
import { AuthContext } from '../context/AuthContext'

function BibliotecaJuegos() {
  const { user } = useContext(AuthContext)
  // Estados principales: lista original, lista filtrada, y estados de carga/error.
  const [juegos, setJuegos] = useState([])
  const [juegosFiltrados, setJuegosFiltrados] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [opciones, setOpciones] = useState({ plataformas: [], generos: [] })
  const [filtros, setFiltros] = useState({
    titulo: '',
    genero: '',
    plataforma: '',
    estado: '',
    minPuntuacion: ''
  })

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setCargando(true)
        const [lista, opts] = await Promise.all([
          api.get('/api/juegos'),
          api.get('/api/juegos/opciones')
        ])
        setJuegos(lista.data)
        setJuegosFiltrados(lista.data)
        setOpciones(opts.data)
        setCargando(false)
      } catch (error) {
        setError('Debes iniciar sesión para ver tu biblioteca personal')
        setCargando(false)
      }
    }
    if (user) obtenerDatos(); else { setCargando(false); setError('Debes iniciar sesión para ver tu biblioteca personal') }
  }, []);

  // Cada vez que cambian los filtros o los juegos, recalculamos la lista filtrada.
  useEffect(() => {
    let resultado = [...juegos];
    
    // Filtrar por título
    if (filtros.titulo) {
      resultado = resultado.filter(juego => 
        juego.titulo.toLowerCase().includes(filtros.titulo.toLowerCase())
      );
    }
    
    // Filtrar por estado
    if (filtros.estado) {
      resultado = resultado.filter(juego => 
        filtros.estado === 'completado' ? juego.completado : !juego.completado
      );
    }
    
    // Filtrar por género
    if (filtros.genero) {
      resultado = resultado.filter(juego => 
        (juego.genero || '').toLowerCase().includes(filtros.genero.toLowerCase())
      );
    }

    if (filtros.plataforma) {
      resultado = resultado.filter(juego => 
        (juego.plataforma || '').toLowerCase().includes(filtros.plataforma.toLowerCase())
      );
    }

    if (filtros.minPuntuacion) {
      const min = parseFloat(filtros.minPuntuacion)
      resultado = resultado.filter(juego => Number(juego.puntuacion) >= min)
    }
    
    setJuegosFiltrados(resultado);
  }, [filtros, juegos]);

  if (cargando) return <div className="cargando">Cargando juegos...</div>
  if (!user) return <div className="error">Debes iniciar sesión para ver tu biblioteca personal</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="biblioteca-juegos">
      <h2>Mi Biblioteca de Juegos</h2>
      <Filtros filtros={filtros} setFiltros={setFiltros} opciones={opciones} />
      {juegosFiltrados.length === 0 ? (
        <p className="sin-juegos">No hay juegos que coincidan con los filtros.</p>
      ) : (
        <div className="grid-juegos">
          {juegosFiltrados.map(juego => (
            <TarjetaJuego
              key={juego._id}
              juego={juego}
              onDeleted={id => {
                setJuegos(prev => prev.filter(j => j._id !== id))
                setJuegosFiltrados(prev => prev.filter(j => j._id !== id))
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default BibliotecaJuegos;