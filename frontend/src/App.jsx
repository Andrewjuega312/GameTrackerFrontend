// Este archivo arma el esqueleto de toda la aplicación.
// Explicación sencilla:
// - Usamos React Router para movernos entre pantallas.
// - El <Header /> aparece en todas las páginas.
// - En <Routes> definimos cada ruta y el componente que se muestra.
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Inicio from './pages/Inicio'
import BibliotecaGeneral from './pages/BibliotecaGeneral'
import BibliotecaPersonal from './pages/BibliotecaPersonal'
import Perfil from './pages/Perfil'
import AgregarJuego from './pages/AgregarJuego'
import EditarJuego from './pages/EditarJuego'
import DetalleJuego from './pages/DetalleJuego'
import Estadisticas from './pages/Estadisticas'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Resenas from './pages/Resenas'
import './App.css'

function App() {
  // Componente principal: envuelve todo en <Router> para habilitar navegación.
  return (
    <Router>
      <div className="app">
        {/* Encabezado fijo arriba en todas las páginas */}
        <Header />
        <main className="contenido">
          <Routes>
            {/* Rutas públicas: cualquiera puede verlas */}
            <Route path="/" element={<BibliotecaGeneral />} />
            <Route path="/biblioteca-general" element={<BibliotecaGeneral />} />
            {/* Rutas que pueden requerir autenticación internamente */}
            <Route path="/biblioteca-personal" element={<BibliotecaPersonal />} />
            <Route path="/agregar" element={<AgregarJuego />} />
            <Route path="/editar/:id" element={<EditarJuego />} />
            {/* Vista detallada de un juego: usa :id para cargar datos específicos */}
            <Route path="/juego/:id" element={<DetalleJuego />} />
            <Route path="/estadisticas" element={<Estadisticas />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/resenas" element={<Resenas />} />
            <Route path="/perfil" element={<Perfil />} />
          </Routes>
        </main>
        <footer className="footer">
          {/* Pie de página con créditos simples */}
          <p>GameTracker - Creado por Andrés Montes y Alejandro Lopera</p>
        </footer>
      </div>
    </Router>
  )
}

export default App
