// Filtros de búsqueda
// Permiten filtrar por título, género, plataforma, estado y puntuación mínima.
import React from 'react'
import '../styles/Filtros.css'

function Filtros({ filtros, setFiltros, opciones }) {
  // Actualiza el estado de filtros según el campo cambiado.
  const handleChange = e => {
    const { name, value } = e.target
    setFiltros(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="filtros-container">
      <h3>Filtrar juegos</h3>
      <div className="filtros">
        <input
          type="text"
          name="titulo"
          placeholder="Buscar por título"
          value={filtros.titulo}
          onChange={handleChange}
        />
        {opciones?.generos?.length ? (
          <select name="genero" value={filtros.genero} onChange={handleChange}>
            <option value="">Todos los géneros</option>
            {opciones.generos.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        ) : (
          <input
            type="text"
            name="genero"
            placeholder="Género"
            value={filtros.genero}
            onChange={handleChange}
          />
        )}
        {opciones?.plataformas?.length ? (
          <select name="plataforma" value={filtros.plataforma} onChange={handleChange}>
            <option value="">Todas las plataformas</option>
            {opciones.plataformas.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        ) : (
          <input
            type="text"
            name="plataforma"
            placeholder="Plataforma"
            value={filtros.plataforma}
            onChange={handleChange}
          />
        )}
        <select name="estado" value={filtros.estado} onChange={handleChange}>
          <option value="">Todos los estados</option>
          <option value="completado">Completados</option>
          <option value="pendiente">Pendientes</option>
        </select>
        <div className="filtros-puntuacion">
          {/* Botones rápidos para fijar la puntuación mínima */}
          <button type="button" onClick={() => setFiltros(f => ({ ...f, minPuntuacion: '1' }))}>+1</button>
          <button type="button" onClick={() => setFiltros(f => ({ ...f, minPuntuacion: '2' }))}>+2</button>
          <button type="button" onClick={() => setFiltros(f => ({ ...f, minPuntuacion: '3' }))}>+3</button>
          <button type="button" onClick={() => setFiltros(f => ({ ...f, minPuntuacion: '4' }))}>+4</button>
          <button type="button" onClick={() => setFiltros(f => ({ ...f, minPuntuacion: '5' }))}>+5</button>
          <button type="button" onClick={() => setFiltros(f => ({ ...f, minPuntuacion: '' }))}>Todas</button>
        </div>
      </div>
    </div>
  )
}

export default Filtros