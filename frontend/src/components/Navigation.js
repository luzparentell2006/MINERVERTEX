import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaProject, FaUsers, FaUser } from 'react-icons/fa';
import '../styles/Navigation.css';

function Navigation({ seccionActual, setSeccionActual }) {
  const navigate = useNavigate();

  const navItems = [
    { id: 'hogar', label: 'Hogar', icon: <FaHome />, path: '/dashboard/hogar' },
    { id: 'proyecto', label: 'Proyecto', icon: <FaProject />, path: '/dashboard/proyecto' },
    { id: 'equipo', label: 'Equipo', icon: <FaUsers />, path: '/dashboard/equipo' },
    { id: 'perfil', label: 'A mi', icon: <FaUser />, path: '/dashboard/perfil' }
  ];

  const handleNavigation = (item) => {
    setSeccionActual(item.id);
    navigate(item.path);
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${seccionActual === item.id ? 'active' : ''}`}
            onClick={() => handleNavigation(item)}
            title={item.label}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

export default Navigation;
