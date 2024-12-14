"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function PatientEvaluationsPage() {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCompletedAppointments = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No se encontró un token de autenticación.");
        return;
      }

      try {
        const response = await axios.get(
          "https://newcareplusback.onrender.com/api/appointments/patient/completed",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setAppointments(response.data);
        setError("");
      } catch (error) {
        console.error("Error al cargar citas completadas:", error);
        setError(
          error.response?.data?.error ||
            "Error desconocido al cargar las citas completadas."
        );
      }
    };

    fetchCompletedAppointments();
  }, []);

  const handleEvaluationSubmit = async () => {
    if (!rating) {
      setError("Por favor selecciona una calificación.");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "https://newcareplusback.onrender.com/api/evaluations",
        {
          appointmentId: selectedAppointment,
          rating,
          comment,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Evaluación enviada exitosamente.");
      setRating(0);
      setComment("");
      setSelectedAppointment(null);

      // Actualizar el estado de las citas para marcar la cita como evaluada
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === selectedAppointment
            ? { ...appointment, rated: true }
            : appointment
        )
      );
    } catch (error) {
      console.error("Error al enviar la evaluación:", error);
      setError(
        error.response?.data?.error ||
          "Error desconocido al enviar la evaluación."
      );
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-screen-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Evaluar Citas Completadas</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {message && <p className="text-green-500 mb-4">{message}</p>}
      <div className="bg-white shadow-md p-6 rounded">
        {appointments.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <li key={appointment.id} className="py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p>
                      <strong>Profesional:</strong> {appointment.professional.name}
                    </p>
                    <p>
                      <strong>Fecha:</strong>{" "}
                      {new Date(appointment.scheduled_time).toLocaleDateString()}
                    </p>
                    {appointment.rated && (
                      <p className="text-green-500 font-bold">
                        Evaluada
                      </p>
                    )}
                  </div>
                  {!appointment.rated && (
                    <button
                      onClick={() => setSelectedAppointment(appointment.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Evaluar
                    </button>
                  )}
                </div>
                {selectedAppointment === appointment.id && !appointment.rated && (
                  <div className="mt-4 bg-gray-100 p-4 rounded">
                    <h4 className="text-lg font-bold mb-2">Califica a este Profesional</h4>
                    <div className="flex items-center space-x-4">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          onClick={() => setRating(value)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold border ${
                            rating === value
                              ? "bg-blue-500 text-white"
                              : "bg-white text-gray-500 border-gray-300 hover:bg-gray-100"
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                    <textarea
                      className="w-full mt-4 p-2 border rounded"
                      rows="4"
                      placeholder="Escribe un comentario (opcional)"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={handleEvaluationSubmit}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Enviar Evaluación
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">
            No tienes citas completadas para evaluar.
          </p>
        )}
      </div>
    </div>
  );
}
