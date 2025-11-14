import React, { useEffect, useMemo, useState } from 'react'
import api from '../api/axios'
import '../styles/BibliotecaGeneral.css'

function BibliotecaGeneral() {
  const [juegos, setJuegos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [opciones, setOpciones] = useState({ plataformas: [], generos: [] })
  const [filtros, setFiltros] = useState({ titulo: '', genero: '', plataforma: '' })

  useEffect(() => {
    const cargar = async () => {
      try {
        const [cat, opts] = await Promise.all([
          api.get('/api/catalogo-juegos'),
          api.get('/api/catalogo-juegos/opciones')
        ])
        setJuegos(cat.data)
        setOpciones(opts.data)
        setCargando(false)
      } catch (e) {
        setError('No se pudo cargar el catálogo')
        setCargando(false)
      }
    }
    cargar()
  }, [])

  function norm(s) { return String(s || '').trim().toLowerCase() }

  const filtrados = useMemo(() => {
    const t = norm(filtros.titulo)
    const g = norm(filtros.genero)
    const p = norm(filtros.plataforma)
    const vistos = new Set()
    const r = []
    for (const j of juegos) {
      const clave = norm(j.titulo) + '|' + norm(j.plataforma)
      if (vistos.has(clave)) continue
      if (t && !norm(j.titulo).includes(t)) continue
      if (g && norm(j.genero) !== g) continue
      if (p && norm(j.plataforma) !== p) continue
      vistos.add(clave)
      r.push(j)
    }
    return r
  }, [juegos, filtros])

  if (cargando) return <div className={'contenido'}><h2>Biblioteca General</h2><div>Cargando...</div></div>
  if (error) return <div className={'contenido'}><h2>Biblioteca General</h2><div className="error">{error}</div></div>

  return (
    <div className={'contenido'}>
      <h2>Biblioteca General</h2>
      <div className="filtros" style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Buscar por título"
          value={filtros.titulo}
          onChange={e => setFiltros(f => ({ ...f, titulo: e.target.value }))}
        />
        <select
          value={filtros.genero}
          onChange={e => setFiltros(f => ({ ...f, genero: e.target.value }))}
        >
          <option value="">Todos los géneros</option>
          {opciones.generos.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <select
          value={filtros.plataforma}
          onChange={e => setFiltros(f => ({ ...f, plataforma: e.target.value }))}
        >
          <option value="">Todas las plataformas</option>
          {opciones.plataformas.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <div className="resenas-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
        {filtrados.map(j => (
          <div key={j._id} className="tarjeta-juego">
            {j.portada && <img src={j.portada} alt={j.titulo} className="portada" />}
            <h3>{j.titulo}</h3>
            <div className="horas">{j.plataforma}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BibliotecaGeneral