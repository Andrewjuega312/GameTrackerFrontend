// Este archivo arma el esqueleto de toda la aplicación.
// Aquí definimos las rutas (las "pantallas") y el diseño principal.
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Inicio from './pages/Inicio'
import AgregarJuego from './pages/AgregarJuego'
import EditarJuego from './pages/EditarJuego'
import DetalleJuego from './pages/DetalleJuego'
import Estadisticas from './pages/Estadisticas'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Resenas from './pages/Resenas'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        {/* El encabezado que se muestra en todas las páginas */}
        <Header />
        <main className="contenido">
          <Routes>
            {/* Página principal con la biblioteca de juegos */}
            <Route path="/" element={<Inicio />} />
            <Route path="/agregar" element={<AgregarJuego />} />
            <Route path="/editar/:id" element={<EditarJuego />} />
            {/* Vista detallada de un juego seleccionado */}
            <Route path="/juego/:id" element={<DetalleJuego />} />
            <Route path="/estadisticas" element={<Estadisticas />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/resenas" element={<Resenas />} />
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
