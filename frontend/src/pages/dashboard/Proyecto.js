import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Proyecto.css';

function Proyecto() {
  const [inversiones, setInversiones] = useState([]);
  const [gananciaHoy, setGananciaHoy] = useState(0);
  const [cargando, setCargando] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    cargarInversiones();
  }, []);

  const cargarInversiones = async () => {
    try {
      const response = await axios.get('/api/investments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInversiones(response.data);
    } catch (error) {
      console.error('Error cargando inversiones:', error);
    }
  };

  const mineriaDelDia = async () => {
    setCargando(true);
    try {
      const response = await axios.post('/api/investments/mineria-diaria', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGananciaHoy(parseFloat(response.data.gananciaHoy));
      alert(`✅ Ganancia del día: ${response.data.gananciaHoy} USDT`);
      cargarInversiones();
    } catch (error) {
      alert(error.response?.data?.mensaje || 'Error en minería');
    } finally {
      setCargando(false);
    }
  };

  const crearInversion = async () => {
    setCargando(true);
    try {
      await axios.post('/api/investments/crear', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Inversión creada exitosamente');
      cargarInversiones();
    } catch (error) {
      alert(error.response?.data?.mensaje || 'Error al crear inversión');
    } finally {
      setCargando(false);
    }
  };

  const inversion = inversiones.find(inv => inv.estado === 'activa');

  return (
    <div className="proyecto-container">
      <h2>Mis Inversiones</h2>

      {inversion ? (
        <div className="inversion-card">
          <div className="card-header">
            <h3>Inversión Activa</h3>
            <span className="estado-badge activa">Activa</span>
          </div>

          <div className="card-body">
            <div className="stat-row">
              <div className="stat-item">
                <label>Monto Invertido</label>
                <span className="valor">{inversion.montoInicial} USDT</span>
              </div>
              <div className="stat-item">
                <label>Ganancias Acumuladas</label>
                <span className="valor">{inversion.gananciasAcumuladas.toFixed(2)} USDT</span>
              </div>
            </div>

            <div className="stat-row">
              <div className="stat-item">
                <label>Días Restantes</label>
                <span className="valor">{inversion.diasRestantes}</span>
              </div>
              <div className="stat-item">
                <label>Ganancia Diaria</label>
                <span className="valor">{inversion.gananciaDiaria.toFixed(2)} USDT</span>
              </div>
            </div>

            <div className="progress-bar">
              <div className="progress" style={{
                width: `${((31 - inversion.diasRestantes) / 31) * 100}%`
              }}></div>
            </div>
            <p className="progress-text">{((31 - inversion.diasRestantes) / 31 * 100).toFixed(0)}% completado</p>
          </div>

          <div className="card-footer">
            <button className="btn btn-success" onClick={mineriaDelDia} disabled={cargando}>
              {cargando ? 'Procesando...' : 'Minería del Día'}
            </button>
          </div>
        </div>
      ) : (
        <div className="sin-inversiones">
          <p>No tienes inversiones activas</p>
          <button className="btn btn-primary" onClick={crearInversion} disabled={cargando}>
            {cargando ? 'Creando...' : 'Crear Inversión (50 USDT)'}
          </button>
        </div>
      )}

      <h3>Historial de Inversiones</h3>
      <div className="inversiones-lista">
        {inversiones.map(inv => (
          <div key={inv._id} className="inversion-item">
            <div className="item-info">
              <span className={`estado ${inv.estado}`}>{inv.estado}</span>
              <span className="monto">{inv.montoInicial} USDT</span>
            </div>
            <div className="item-fecha">
              {new Date(inv.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Proyecto;
