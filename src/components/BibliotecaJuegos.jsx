// Esta vista muestra tu biblioteca de juegos y permite filtrarlos.
// Aquí cargamos los juegos desde la API y aplicamos filtros simples.
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import TarjetaJuego from './TarjetaJuego';
import Filtros from './Filtros';
import '../styles/BibliotecaJuegos.css';

function BibliotecaJuegos() {
  // Estados principales: lista original, lista filtrada, y estados de carga/error.
  const [juegos, setJuegos] = useState([]);
  const [juegosFiltrados, setJuegosFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtros, setFiltros] = useState({
    titulo: '',
    genero: '',
    plataforma: '',
    estado: '',
    puntuacion: ''
  });

  useEffect(() => {
    const obtenerJuegos = async () => {
      try {
        setCargando(true);
        const respuesta = await api.get('/api/juegos');
        setJuegos(respuesta.data);
        setJuegosFiltrados(respuesta.data);
        setCargando(false);
      } catch (error) {
        console.error('Error al cargar juegos:', error);
        setCargando(false);
      }
    };

    obtenerJuegos();
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

  if (cargando) return <div className="cargando">Cargando juegos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="biblioteca-juegos">
      <h2>Mi Biblioteca de Juegos</h2>
      {/* Componente con los campos para filtrar la lista */}
      <Filtros filtros={filtros} setFiltros={setFiltros} />
      {juegosFiltrados.length === 0 ? (
        <p className="sin-juegos">No hay juegos que coincidan con los filtros.</p>
      ) : (
        <div className="grid-juegos">
          {juegosFiltrados.map(juego => (
            <TarjetaJuego
              key={juego._id}
              juego={juego}
              onDeleted={(id) => {
                // Si se borra un juego, lo quitamos de ambas listas
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