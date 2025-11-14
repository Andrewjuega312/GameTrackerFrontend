// El encabezado superior de la app: muestra el logo, navegación y acciones.
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import BotonTema from './BotonTema';
import { AuthContext } from '../context/AuthContext';
import '../styles/Header.css';
import PanelUsuario from './PanelUsuario';

function Header() {
  const { user } = useContext(AuthContext) // Si hay usuario, mostramos opciones adicionales
  const [panelAbierto, setPanelAbierto] = useState(false) // Controla si el panel de usuario está abierto
  return (
    <header className="header">
      <div className="logo-container">
        <img src="/Logo_GameTracker.png" alt="GameTracker Logo" className="logo" />
        <h1>GameTracker</h1>
      </div>
      <nav>
        <ul>
          <li><Link to="/biblioteca-general">Biblioteca General</Link></li>
          <li><Link to="/biblioteca-personal">Biblioteca Personal</Link></li>
          <li><Link to="/agregar">Agregar Juego</Link></li>
          <li><Link to="/estadisticas">Estadísticas</Link></li>
          {user && <li><Link to="/perfil">Perfil</Link></li>}
          {/* Si estás logueado, ves el link a Reseñas y tu nombre */}
          {user && <li><Link to="/resenas">Reseñas</Link></li>}
          {/* Si NO estás logueado, aparecen Login y Registro */}
          {!user && <li><Link to="/login">Login</Link></li>}
          {!user && <li><Link to="/registro">Registro</Link></li>}
          {user && <li><button className="btn-ver" onClick={() => setPanelAbierto(v => !v)}>{user.nombre}</button></li>}
        </ul>
      </nav>
      <div className="header-actions">
        {/* Botón para cambiar entre modo claro y oscuro */}
        <BotonTema />
      </div>
      {/* Panel flotante con tus favoritos y reseñas */}
      {panelAbierto && user && <PanelUsuario onClose={() => setPanelAbierto(false)} />}
    </header>
  );
}

export default Header;