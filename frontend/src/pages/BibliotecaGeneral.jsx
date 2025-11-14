import React, { useEffect, useMemo, useState, useContext } from 'react'
import api from '../api/axios'
import Filtros from '../components/Filtros'
import TarjetaJuegoSimple from '../components/TarjetaJuegoSimple'
import { AuthContext } from '../context/AuthContext'

// Biblioteca General
// Aquí mostramos todos los juegos que existen para que cualquiera los vea.
// La idea es que puedas ver, buscar y reseñar aunque no sean tuyos.
export default function BibliotecaGeneral() {
  const { user } = useContext(AuthContext)
  const [juegos, setJuegos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  // Usamos la misma estructura de filtros que en Mi Biblioteca
  const [filtros, setFiltros] = useState({ titulo: '', genero: '', plataforma: '' })

  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true)
        const { data } = await api.get('/api/catalogo-juegos')
        setJuegos(data || [])
        setError('')
      } catch (e) {
        setError('No se pudieron cargar los juegos')
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  // Opciones únicas de plataforma y género, generadas desde todos los juegos
  // Opciones de filtros desde backend (sin duplicados)
  const [opciones, setOpciones] = useState({ plataformas: [], generos: [] })
  useEffect(() => {
    const cargarOpciones = async () => {
      try {
        const { data } = await api.get('/api/catalogo-juegos/opciones')
        setOpciones({
          plataformas: data?.plataformas || [],
          generos: data?.generos || []
        })
      } catch (e) {
        setOpciones({ plataformas: [], generos: [] })
      }
    }
    cargarOpciones()
  }, [])

  const filtrados = useMemo(() => {
    let resultado = [...juegos]
    if (filtros.titulo) {
      resultado = resultado.filter(j => j.titulo?.toLowerCase().includes(filtros.titulo.toLowerCase()))
    }
    if (filtros.genero) {
      resultado = resultado.filter(j => (j.genero || '').toLowerCase().includes(filtros.genero.toLowerCase()))
    }
    if (filtros.plataforma) {
      resultado = resultado.filter(j => (j.plataforma || '').toLowerCase().includes(filtros.plataforma.toLowerCase()))
    }
    // Para evitar ver repetidos, deduplicamos por título+plataforma
    const vistos = new Set()
    const sinDuplicados = []
    for (const j of resultado) {
      const clave = (j.titulo || '').trim().toLowerCase() + '|' + (j.plataforma || '').trim().toLowerCase()
      if (!vistos.has(clave)) {
        vistos.add(clave)
        sinDuplicados.push(j)
      }
    }
    return sinDuplicados
  }, [juegos, filtros])

  if (cargando) return <div className="cargando">Cargando...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="biblioteca-juegos">
      <h2>Biblioteca General</h2>
      {/* Filtros simples para buscar juegos por nombre, género, etc. */}
      <Filtros filtros={filtros} setFiltros={setFiltros} opcionesPlataformas={opciones.plataformas} opcionesGeneros={opciones.generos} />
      {/* Lista de tarjetas con los juegos filtrados */}
      {filtrados.length === 0 ? (
        <p className="sin-juegos">No hay juegos con esos filtros.</p>
      ) : (
        <div className="grid-juegos">
          {filtrados.map(j => (
            <TarjetaJuegoSimple key={j._id} juego={j} onDeleted={(id) => setJuegos(prev => prev.filter(x => x._id !== id))} />
          ))}
        </div>
      )}
      {/* Nota: En la Biblioteca General no mostramos botones de edición/borrado */}
    </div>
  )
}