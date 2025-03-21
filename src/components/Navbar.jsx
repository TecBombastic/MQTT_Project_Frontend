import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ mqttConnected }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Sistema de Comandas</h1>
      </div>
      <div className="navbar-menu">
        <Link to="/" className="navbar-item">Crear Pedido</Link>
        <Link to="/reception" className="navbar-item">Recepción</Link>
        
        <div className={`mqtt-status ${mqttConnected ? 'connected' : 'disconnected'}`}>
          <span className="status-dot"></span>
          {mqttConnected ? 'Conectado' : 'Desconectado'}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;