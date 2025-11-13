// Formulario para escribir una reseña (opinión) sobre un juego.
import React, { useState, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/FormularioResena.css';

function FormularioResena({ juegoId, onResenaNueva }) {
  const { user } = useContext(AuthContext)
  const [formulario, setFormulario] = useState({
    autor: user?.nombre || 'Usuario',
    texto: '',
    estrellas: 5
  });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  // Actualiza los campos al escribir; convierte estrellas a número.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario({
      ...formulario,
      [name]: name === 'estrellas' ? parseInt(value) : value
    });
  };

  // Envía la reseña a la API. Si no estás logueado, lo avisamos.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Debes iniciar sesión para agregar reseñas');
      return;
    }
    try {
      setEnviando(true);
      const nuevaResena = {
        ...formulario,
        autor: user?.nombre || formulario.autor,
        juegoId
      };
      
      const respuesta = await api.post('/api/resenas', nuevaResena);
      setFormulario({
        autor: user?.nombre || 'Usuario',
        texto: '',
        estrellas: 5
      });
      setEnviando(false);
      
      if (onResenaNueva) {
        onResenaNueva(respuesta.data);
      }
    } catch (err) {
      setError('Error al guardar la reseña');
      setEnviando(false);
    }
  };

  return (
    <div className="formulario-resena-container">
      <h3>Escribe una reseña</h3>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit} className="formulario-resena">
        <div className="campo">
          <label htmlFor="autor">Nombre</label>
          <input
            type="text"
            id="autor"
            name="autor"
            value={formulario.autor}
            onChange={handleChange}
            required
          />
        </div>
        <div className="campo">
          <label htmlFor="estrellas">Puntuación</label>
          <div className="selector-estrellas">
            {[1, 2, 3, 4, 5].map(valor => (
              <label key={valor} className="estrella-label">
                <input
                  type="radio"
                  name="estrellas"
                  value={valor}
                  checked={formulario.estrellas === valor}
                  onChange={handleChange}
                />
                <span className={valor <= formulario.estrellas ? 'estrella-llena' : 'estrella-vacia'}>
                  ★
                </span>
              </label>
            ))}
          </div>
        </div>
        <div className="campo">
          <label htmlFor="texto">Tu opinión</label>
          <textarea
            id="texto"
            name="texto"
            value={formulario.texto}
            onChange={handleChange}
            required
            rows="4"
          ></textarea>
        </div>
        <button type="submit" className="btn-enviar" disabled={enviando}>
          {enviando ? 'Enviando...' : 'Enviar Reseña'}
        </button>
      </form>
    </div>
  );
}

export default FormularioResena;