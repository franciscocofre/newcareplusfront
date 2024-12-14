"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Cargar citas al montar el componente
  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No se encontró un token de autenticación.");
        return;
      }

      try {
        const response = await axios.get(
          "https://newcareplusback.onrender.com/api/appointments/patient/simplified",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setAppointments(response.data);
        setError("");
      } catch (error) {
        console.error("Error al cargar citas:", error);
        setError(
          error.response?.data?.error ||
            "Error desconocido al cargar las citas."
        );
      }
    };

    fetchAppointments();
  }, []);

  // Cancelar cita
  const handleCancelRequest = async (appointmentId) => {
    const token = localStorage.getItem("token");
    if (!cancellationReason.trim()) {
      setError("Proporciona un motivo de cancelación.");
      return;
    }

    try {
      await axios.post(
        "https://newcareplusback.onrender.com/api/appointments/cancel",
        {
          appointment_id: appointmentId,
          cancellation_reason: cancellationReason,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Cita cancelada exitosamente.");
      setCancellationReason("");
      setSelectedAppointment(null);

      setAppointments((prev) =>
        prev.filter((appointment) => appointment.id !== appointmentId)
      );
    } catch (error) {
      console.error("Error al cancelar la cita:", error);
      setError(
        error.response?.data?.error ||
          "No se pudo cancelar la cita. Intenta nuevamente."
      );
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-screen-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Mis Citas</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {message && <p className="text-green-500 mb-4">{message}</p>}

      <div className="bg-white shadow-md p-6 rounded mb-6">
        {appointments.length > 0 ? (
          <ul className="space-y-6">
            {appointments.map((appointment) => (
              <li
                key={appointment.id}
                className="p-6 rounded bg-gray-50 shadow hover:shadow-md border"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-lg font-semibold">
                      <strong>Médico:</strong>{" "}
                      {appointment.professional_name || "Desconocido"}
                    </p>
                    <p>
                      <strong>Fecha:</strong>{" "}
                      {new Date(appointment.scheduled_time).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Hora:</strong>{" "}
                      {new Date(
                        appointment.scheduled_time
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p>
                      <strong>Estado:</strong>{" "}
                      <span
                        className={`${
                          appointment.status === "confirmed"
                            ? "text-green-500"
                            : appointment.status === "pending"
                            ? "text-yellow-500"
                            : appointment.status === "cancelled"
                            ? "text-red-500"
                            : "text-gray-500"
                        }`}
                      >
                        {appointment.status.charAt(0).toUpperCase() +
                          appointment.status.slice(1)}
                      </span>
                    </p>
                  </div>
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => setSelectedAppointment(appointment.id)}
                  >
                    Opciones
                  </button>
                </div>

                {selectedAppointment === appointment.id && (
                  <div className="mt-6 p-4 bg-gray-100 border rounded">
                    <h4 className="text-lg font-bold mb-2">Cancelar Cita</h4>
                    <textarea
                      className="w-full p-2 border rounded mb-2"
                      rows="3"
                      placeholder="Motivo de la cancelación"
                      value={cancellationReason}
                      onChange={(e) => setCancellationReason(e.target.value)}
                    />
                    <button
                      onClick={() => handleCancelRequest(appointment.id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Confirmar Cancelación
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">
            No tienes citas programadas.
          </p>
        )}
      </div>
    </div>
  );
}
