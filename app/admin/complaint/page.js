"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminComplaintPage() {
  const [complaints, setComplaints] = useState([]);
  const [filterRole, setFilterRole] = useState(""); // Filtro por rol
  const [responseText, setResponseText] = useState(""); // Respuesta del administrador
  const [selectedComplaint, setSelectedComplaint] = useState(null); // Reclamo seleccionado
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchComplaints = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No se encontró un token válido. Por favor, inicie sesión.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3001/api/complaints/with-users${filterRole ? `?role=${filterRole}` : ""}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComplaints(response.data);
      setError("");
    } catch (err) {
      console.error("Error al obtener los reclamos:", err);
      setError(err.response?.data?.error || "Error desconocido al obtener los reclamos.");
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [filterRole]);

  const handleResponse = async (id) => {
    const token = localStorage.getItem("token");
    if (!responseText.trim()) {
      setError("La respuesta no puede estar vacía.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:3001/api/complaints/${id}/response`,
        { response: responseText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Respuesta enviada exitosamente.");
      setResponseText("");
      fetchComplaints();
    } catch (err) {
      console.error("Error al responder el reclamo:", err);
      setError(err.response?.data?.error || "Error al enviar la respuesta.");
    }
  };

  const handleClose = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `http://localhost:3001/api/complaints/${id}/close`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Reclamo cerrado exitosamente.");
      fetchComplaints();
    } catch (err) {
      console.error("Error al cerrar el reclamo:", err);
      setError(err.response?.data?.error || "Error al cerrar el reclamo.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gestión de Reclamos</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {message && <p className="text-green-500 mb-4">{message}</p>}

      <div className="mb-6">
        <label className="block text-gray-700 font-semibold mb-2">Filtrar por rol:</label>
        <select
          className="border rounded p-2"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="paciente">Paciente</option>
          <option value="profesional">Profesional</option>
        </select>
      </div>

      {complaints.length > 0 ? (
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <div
              key={complaint.complaint_id}
              className="p-4 border rounded shadow bg-white"
            >
              <h3 className="text-xl font-bold">{complaint.complaint_title}</h3>
              <p>
                <strong>Descripción:</strong> {complaint.complaint_description}
              </p>
              <p>
                <strong>Estado:</strong>{" "}
                <span
                  className={`${
                    complaint.complaint_status === "resolved"
                      ? "text-green-500"
                      : complaint.complaint_status === "closed"
                      ? "text-gray-500"
                      : "text-yellow-500"
                  }`}
                >
                  {complaint.complaint_status.charAt(0).toUpperCase() +
                    complaint.complaint_status.slice(1)}
                </span>
              </p>
              <p>
                <strong>Usuario:</strong> {complaint.user_name} (
                {complaint.user_role})
              </p>
              {complaint.complaint_response && (
                <p>
                  <strong>Respuesta:</strong> {complaint.complaint_response}
                </p>
              )}

              {complaint.complaint_status === "pending" && (
                <div className="mt-4">
                  <textarea
                    className="w-full border rounded p-2 mb-2"
                    rows="3"
                    placeholder="Escribe una respuesta"
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                  />
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                    onClick={() => handleResponse(complaint.complaint_id)}
                  >
                    Responder
                  </button>
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    onClick={() => handleClose(complaint.complaint_id)}
                  >
                    Cerrar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No se encontraron reclamos.</p>
      )}
    </div>
  );
}
