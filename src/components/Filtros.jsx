// Controles para filtrar la lista de juegos por título, género, plataforma, estado y puntuación.
import React from 'react';
import '../styles/Filtros.css';

function Filtros({ filtros, setFiltros }) {
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
        <input
          type="text"
          name="genero"
          placeholder="Género"
          value={filtros.genero}
          onChange={handleChange}
        />
        <input
          type="text"
          name="plataforma"
          placeholder="Plataforma"
          value={filtros.plataforma}
          onChange={handleChange}
        />
        <select 
          name="estado" 
          value={filtros.estado} 
          onChange={handleChange}
        >
          <option value="">Todos los estados</option>
          <option value="completado">Completados</option>
          <option value="pendiente">Pendientes</option>
        </select>
        {/* Atajos rápidos para filtrar por puntuación mínima */}
        <div className="filtros-puntuacion">
          <button type="button" onClick={() => setFiltros(f => ({...f, minPuntuacion: '1'}))}>+1</button>
          <button type="button" onClick={() => setFiltros(f => ({...f, minPuntuacion: '2'}))}>+2</button>
          <button type="button" onClick={() => setFiltros(f => ({...f, minPuntuacion: '3'}))}>+3</button>
          <button type="button" onClick={() => setFiltros(f => ({...f, minPuntuacion: '4'}))}>+4</button>
          <button type="button" onClick={() => setFiltros(f => ({...f, minPuntuacion: '5'}))}>+5</button>
          <button type="button" onClick={() => setFiltros(f => ({...f, minPuntuacion: ''}))}>Todas</button>
        </div>
      </div>
    </div>
  );
}

export default Filtros;