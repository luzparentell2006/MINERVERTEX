import React, { useState, useEffect } from 'react';
import { FaPlus, FaMinus, FaDownload, FaBuilding, FaUsers, FaSharedAlt } from 'react-icons/fa';
import axios from 'axios';
import Recarga from '../../components/modals/Recarga';
import Retiro from '../../components/modals/Retiro';
import Referidos from '../../components/modals/Referidos';
import ImageCarousel from '../../components/ImageCarousel';
import '../../styles/Hogar.css';

function Hogar({ setDatosUsuario }) {
  const [usuario, setUsuario] = useState(JSON.parse(localStorage.getItem('usuario')));
  const [modalRecarga, setModalRecarga] = useState(false);
  const [modalRetiro, setModalRetiro] = useState(false);
  const [modalReferidos, setModalReferidos] = useState(false);
  const [inversion, setInversion] = useState(null);
  const [cargando, setCargando] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [resUsuario, resInversiones] = await Promise.all([
        axios.get('/api/users/resumen', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('/api/investments', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setUsuario(resUsuario.data);
      const invActiva = resInversiones.data.find(inv => inv.estado === 'activa');
      setInversion(invActiva);
      setDatosUsuario(resUsuario.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setCargando(false);
    }
  };

  const iconos = [
    { id: 'recarga', label: 'Recarga', icon: <FaPlus />, color: '#10b981', action: () => setModalRecarga(true) },
    { id: 'retiro', label: 'Retirar', icon: <FaMinus />, color: '#ef4444', action: () => setModalRetiro(true) },
    { id: 'app', label: 'Aplicación', icon: <FaDownload />, color: '#3b82f6', action: () => alert('Descargando app...') },
    { id: 'empresa', label: 'Perfil Empresa', icon: <FaBuilding />, color: '#f59e0b', action: () => alert('Información de empresa') },
    { id: 'referidos', label: 'Invitar Amigos', icon: <FaUsers />, color: '#8b5cf6', action: () => setModalReferidos(true) },
    { id: 'cooperacion', label: 'Cooperación', icon: <FaSharedAlt />, color: '#ec4899', action: () => alert('Cooperación entre agencias') }
  ];

  if (cargando) return <div className="hogar-loading">Cargando...</div>;

  return (
    <div className="hogar-container">
      {/* Sección de Iconos Circulares */}
      <div className="iconos-section">
        <div className="iconos-grid">
          {iconos.map(icono => (
            <button
              key={icono.id}
              className="icono-circular"
              style={{ borderColor: icono.color }}
              onClick={icono.action}
              title={icono.label}
            >
              <div className="icono-inner" style={{ backgroundColor: icono.color }}>
                {icono.icon}
              </div>
              <p>{icono.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Carrusel de Imágenes */}
      <ImageCarousel />

      {/* Sala de Proyectos */}
      <div className="proyectos-section">
        <h2>Sala De Proyectos</h2>
        
        <div className="proyecto-card">
          <div className="proyecto-header">
            <h3>Inversión de 31 Días</h3>
            <p className="proyecto-monto">Mínimo: 50 USDT</p>
          </div>

          <div className="proyecto-body">
            <div className="info-item">
              <span className="label">Inversión:</span>
              <span className="valor">50 USDT</span>
            </div>
            <div className="info-item">
              <span className="label">Ganancia Estimada:</span>
              <span className="valor">50 USDT (31 días)</span>
            </div>
            <div className="info-item">
              <span className="label">Comisión Referidos:</span>
              <span className="valor">5%</span>
            </div>
          </div>

          {inversion ? (
            <div className="inversion-activa">
              <h4>Tu Inversión Activa</h4>
              <div className="inversion-info">
                <div className="info-row">
                  <span>Ganancias Acumuladas:</span>
                  <strong>{inversion.gananciasAcumuladas.toFixed(2)} USDT</strong>
                </div>
                <div className="info-row">
                  <span>Días Restantes:</span>
                  <strong>{inversion.diasRestantes}</strong>
                </div>
                <div className="info-row">
                  <span>Ganancia Hoy:</span>
                  <strong>{inversion.gananciaDiaria.toFixed(2)} USDT</strong>
                </div>
              </div>
              <button className="btn btn-success" onClick={cargarDatos}>
                Actualizar
              </button>
            </div>
          ) : (
            <div className="sin-inversion">
              <p>No tienes inversiones activas</p>
              <button className="btn btn-primary" onClick={() => setModalRecarga(true)}>
                Crear Inversión
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      {modalRecarga && <Recarga onClose={() => setModalRecarga(false)} onSuccess={cargarDatos} />}
      {modalRetiro && <Retiro onClose={() => setModalRetiro(false)} onSuccess={cargarDatos} />}
      {modalReferidos && <Referidos onClose={() => setModalReferidos(false)} usuario={usuario} />}
    </div>
  );
}

export default Hogar;
