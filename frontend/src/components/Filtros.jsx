// Controles para filtrar la lista de juegos por título, género, plataforma, estado y puntuación.
import React from 'react';
import '../styles/Filtros.css';

function Filtros({ filtros, setFiltros, opcionesPlataformas = [], opcionesGeneros = [] }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prevFiltros => ({
      ...prevFiltros,
      [name]: value
    }));
  };

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
        {/* Si hay opciones de género y plataforma, mostramos selects sin duplicados */}
        {opcionesGeneros.length > 0 ? (
          <select name="genero" value={filtros.genero} onChange={handleChange}>
            <option value="">Todos los géneros</option>
            {opcionesGeneros.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
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

        {opcionesPlataformas.length > 0 ? (
          <select name="plataforma" value={filtros.plataforma} onChange={handleChange}>
            <option value="">Todas las plataformas</option>
            {opcionesPlataformas.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
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
      </div>
    </div>
  );
}

export default Filtros;