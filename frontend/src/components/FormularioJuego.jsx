// Formulario para agregar o editar un juego.
// Si hay un id en la URL, cargamos el juego y lo editamos; si no, creamos uno nuevo.
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import '../styles/FormularioJuego.css';

function FormularioJuego() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState({
    titulo: '',
    genero: '',
    plataforma: '',
    portada: '',
    horasJugadas: 0,
    completado: false,
    puntuacion: 0
  });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // Si estamos editando, pedimos a la API los datos del juego y los mostramos.
  useEffect(() => {
    if (id) {
      const cargarJuego = async () => {
        try {
          setCargando(true);
          const respuesta = await api.get(`/api/juegos/${id}`);
          setFormulario(respuesta.data);
          setCargando(false);
        } catch (err) {
          setError('Error al cargar el juego');
          setCargando(false);
        }
      };
      cargarJuego();
    }
  }, [id]);

  // Actualizamos el estado del formulario al escribir en los campos.
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulario({
      ...formulario,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Para ayudar al usuario, definimos una lista de géneros válidos.
  const generosPermitidos = [
    'Acción','Aventura','RPG','Deportes','Simulación','Terror','Estrategia','Música','Rompecabezas','Plataformas','Pelea','Carreras','Sandbox','Supervivencia','Shooter','Metroidvania','Roguelike','Roguelite','Mundo Abierto','Táctico','Narrativa','Sigilo','Ritmo','MMORPG','MOBA','Indie'
  ]
  // Al enviar, validamos datos y enviamos al servidor.
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setCargando(true);
      setError(null);
      
      if (!formulario.titulo.trim()) {
        setError('El título es obligatorio');
        setCargando(false);
        return;
      }
      
      if (!generosPermitidos.includes(formulario.genero)) {
        setError('Selecciona un género válido')
        setCargando(false)
        return
      }

      const datosProcesados = {
        ...formulario,
        titulo: formulario.titulo.trim(),
        portada: formulario.portada || 'https://via.placeholder.com/150',
        horasJugadas: Number(formulario.horasJugadas) || 0,
        puntuacion: Number(formulario.puntuacion) || 0
      };
      if (id) {
        await api.put(`/api/juegos/${id}`, datosProcesados);
      } else {
        await api.post('/api/juegos', datosProcesados);
      }
      setCargando(false);
      navigate('/');
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.mensaje || err.response.data.error || 'Error al guardar el juego');
      } else {
        setError('Error de conexión con el servidor');
      }
      setCargando(false);
    }
  };

  // Mensaje de carga solo cuando estamos editando y aún no se han traído los datos.
  if (cargando && id) return <div className="cargando">Cargando juego...</div>;

  return (
    <div className="formulario-container">
      <h2>{id ? 'Editar Juego' : 'Agregar Nuevo Juego'}</h2>
      
      {error && <div className="error-mensaje">{error}</div>}
      
      <form onSubmit={handleSubmit} className="formulario-juego">
        <div className="campo">
          <h3 className="campo-titulo">Título del juego</h3>
          <input
            type="text"
            id="titulo"
            name="titulo"
            value={formulario.titulo}
            onChange={handleChange}
            required
            placeholder="Ingresa el título del juego"
          />
        </div>
        <div className="campo">
          <label htmlFor="genero">Género</label>
          <select id="genero" name="genero" value={formulario.genero} onChange={handleChange} required>
            <option value="">Selecciona un género</option>
            {generosPermitidos.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div className="campo">
          <label htmlFor="plataforma">Plataforma</label>
          <select id="plataforma" name="plataforma" value={formulario.plataforma} onChange={handleChange} required>
            <option value="">Selecciona una plataforma</option>
            <option value="PC">PC</option>
            <option value="PlayStation">PlayStation</option>
            <option value="Xbox">Xbox</option>
            <option value="Nintendo Switch">Nintendo Switch</option>
            <option value="Mobile">Mobile</option>
            <option value="Steam Deck">Steam Deck</option>
            <option value="Mac">Mac</option>
            <option value="Linux">Linux</option>
            <option value="Android">Android</option>
            <option value="iOS">iOS</option>
            <option value="Web">Web</option>
          </select>
        </div>
        <div className="campo">
          <label htmlFor="portada">URL de la Portada</label>
          <input
            type="text"
            id="portada"
            name="portada"
            value={formulario.portada}
            onChange={handleChange}
            placeholder="https://ejemplo.com/imagen.jpg"
          />
        </div>
        <div className="campo">
          <label htmlFor="horasJugadas">Horas Jugadas</label>
          <input
            type="number"
            id="horasJugadas"
            name="horasJugadas"
            value={formulario.horasJugadas}
            onChange={handleChange}
            min="0"
          />
        </div>
        <div className="campo-checkbox">
          <input
            type="checkbox"
            id="completado"
            name="completado"
            checked={formulario.completado}
            onChange={handleChange}
          />
          <label htmlFor="completado">Completado</label>
        </div>
        <div className="campo">
          <label htmlFor="puntuacion">Puntuación (0-5)</label>
          <input
            type="range"
            id="puntuacion"
            name="puntuacion"
            value={formulario.puntuacion}
            onChange={handleChange}
            min="0"
            max="5"
            step="0.1"
          />
          <span>{parseFloat(formulario.puntuacion).toFixed(1)} estrellas</span>
        </div>
        <button type="submit" className="btn-guardar" disabled={cargando}>
          {cargando ? 'Guardando...' : 'Guardar Juego'}
        </button>
      </form>
    </div>
  );
}

export default FormularioJuego;