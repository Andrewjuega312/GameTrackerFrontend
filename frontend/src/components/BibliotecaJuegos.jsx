// Esta vista muestra tu biblioteca de juegos y permite filtrarlos.
// Aquí cargamos los juegos desde la API y aplicamos filtros simples.
// Esta vista muestra TU biblioteca personal.
// Importante: los juegos se filtran por el usuario autenticado en el backend.
import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import TarjetaJuego from './TarjetaJuego';
import Filtros from './Filtros';
import '../styles/BibliotecaJuegos.css';
import { AuthContext } from '../context/AuthContext';

function BibliotecaJuegos() {
  const { user } = useContext(AuthContext) // Si no hay usuario, mostramos un mensaje invitando a iniciar sesión
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
    // Nota: usamos "minPuntuacion" para filtrar por una puntuación mínima
    minPuntuacion: ''
  });

  useEffect(() => {
    const obtenerJuegos = async () => {
      try {
        setCargando(true);
        // Esta ruta devuelve SOLO los juegos del usuario autenticado.
        const respuesta = await api.get('/api/juegos');
        setJuegos(respuesta.data);
        setJuegosFiltrados(respuesta.data);
        setCargando(false);
      } catch (error) {
        console.error('Error al cargar juegos:', error);
        setCargando(false);
      }
    };
    // Si no hay usuario, no pedimos juegos (no tendríamos token válido)
    if (user) obtenerJuegos();
    else {
      setJuegos([])
      setJuegosFiltrados([])
      setCargando(false)
    }
  }, [user]);

  const [opcionesPlataformas, setOpcionesPlataformas] = useState([])
  const [opcionesGeneros, setOpcionesGeneros] = useState([])
  useEffect(() => {
    const cargarOpciones = async () => {
      try {
        const { data } = await api.get('/api/juegos/opciones')
        setOpcionesPlataformas(data?.plataformas || [])
        setOpcionesGeneros(data?.generos || [])
      } catch (e) {
        setOpcionesPlataformas([])
        setOpcionesGeneros([])
      }
    }
    cargarOpciones()
  }, [])

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

  if (!user) {
    return (
      <div className="biblioteca-juegos">
        <h2>Mi Biblioteca de Juegos</h2>
        <p className="sin-juegos">Para ver tu biblioteca personal, inicia sesión.</p>
      </div>
    )
  }

  return (
    <div className="biblioteca-juegos">
      <h2>Mi Biblioteca de Juegos</h2>
      {/* Componente con los campos para filtrar la lista */}
      <Filtros filtros={filtros} setFiltros={setFiltros} opcionesPlataformas={opcionesPlataformas} opcionesGeneros={opcionesGeneros} />
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