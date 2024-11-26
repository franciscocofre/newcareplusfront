"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ProfessionalAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('Token no encontrado');
        setError('Token de autorización no disponible.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:3001/api/appointments/professional/simplified', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(response.data);
      } catch (error) {
        console.error('Error al obtener citas:', error);
        setError('Ocurrió un error al obtener las citas');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Función para mostrar el ícono basado en el estado de la cita
  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return '✅'; // Ticket verde
      case 'pending':
        return '❓'; // Signo de interrogación
      case 'cancelled':
        return '❌'; // X roja
      default:
        return '';
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-5">Mis Citas</h2>
      {loading ? (
        <p>Cargando citas...</p>
      ) : error ? (
        <p className="text-red-500 mb-4">{error}</p>
      ) : (
        <div className="grid gap-4">
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
              <div key={appointment.id} className="bg-white p-4 shadow rounded grid grid-cols-5 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Paciente</p>
                  <p>{appointment.patient_name}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Dirección</p>
                  <p>{appointment.patient_address}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Fecha</p>
                  <p>{new Date(appointment.scheduled_time).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Estado</p>
                  <p>
                    {getStatusIcon(appointment.status)} {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Precio</p>
                  <p>${appointment.total_price}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No tienes citas programadas.</p>
          )}
        </div>
      )}
    </div>
  );
}
