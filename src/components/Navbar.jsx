import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <h1>Sistema de Comandas</h1>
            </div>
            <div className="navbar-menu">
                <Link to="/">Nueva Comanda</Link>
                <Link to="/reception">Recepción</Link>
            </div>
        </nav>
    );
};

export default Navbar;