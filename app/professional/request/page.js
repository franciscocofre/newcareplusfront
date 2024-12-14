"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "./requestStyles.css";

export default function ProfessionalRequestPage() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);

      if (!token) {
        setError("No se encontró un token de autenticación.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "https://newcareplusback.onrender.com/api/appointments/professional/cancel-requests",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setRequests(response.data);
        setError("");
      } catch (error) {
        console.error("Error al cargar solicitudes:", error);
        setError(
          error.response?.data?.error || "No se pudieron cargar las solicitudes de cancelación."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [token]);

  const handleAction = async (appointmentId, action) => {
    if (!["approve", "reject"].includes(action)) {
      setError("Acción inválida.");
      return;
    }

    try {
      const response = await axios.put(
        "https://newcareplusback.onrender.com/api/appointments/cancel-handle",
        { appointmentId, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Actualizar solicitudes en el frontend
      setRequests((prev) => prev.filter((req) => req.id !== appointmentId));
      setMessage(response.data.message);
      setError("");
    } catch (error) {
      console.error("Error al procesar la solicitud de cancelación:", error);
      setError(
        error.response?.data?.error || "Error al procesar la solicitud de cancelación."
      );
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-screen-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Solicitudes de Cancelación</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {message && <p className="text-green-500 mb-4">{message}</p>}

      {loading ? (
        <p>Cargando solicitudes...</p>
      ) : requests.length > 0 ? (
        <div className="grid gap-4">
          {requests.map((request) => (
            <div key={request.id} className="bg-white p-4 shadow rounded">
              <p>
                <strong>Paciente:</strong> {request.patient_name || "Desconocido"}
              </p>
              <p>
                <strong>Motivo:</strong> {request.cancellation_reason || "No especificado"}
              </p>
              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(request.scheduled_time).toLocaleDateString()}
              </p>
              <p>
                <strong>Hora:</strong>{" "}
                {new Date(request.scheduled_time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => handleAction(request.id, "approve")}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Aprobar
                </button>
                <button
                  onClick={() => handleAction(request.id, "reject")}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay solicitudes de cancelación pendientes.</p>
      )}
    </div>
  );
}
