"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function ProfessionalEvaluations() {
  const [evaluations, setEvaluations] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [details, setDetails] = useState({});
  const [error, setError] = useState("");

  // Cargar evaluaciones
  const fetchEvaluations = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token no encontrado");

      const response = await axios.get(
        "https://newcareplusback.onrender.com/api/evaluations/professional/2",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEvaluations(response.data);
    } catch (err) {
      console.error("Error al obtener evaluaciones:", err);
      setError("Error al cargar las evaluaciones.");
    }
  };

  // Cargar detalles del profesional
  const fetchProfessionalDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token no encontrado");

      const response = await axios.get(
        "https://newcareplusback.onrender.com/api/evaluations/details",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDetails(response.data);
    } catch (err) {
      console.error("Error al cargar detalles del profesional:", err);
      setError("Error al cargar los detalles del profesional.");
    }
  };

  // Cargar ganancias por mes
  const fetchEarnings = async (month) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token no encontrado");

      const response = await axios.get(
        `https://newcareplusback.onrender.com/api/reports/total-earnings?month=${month}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEarnings(response.data.earningsByProfessional || []);
    } catch (err) {
      console.error("Error al cargar ganancias:", err);
      setError("Error al cargar las ganancias.");
    }
  };

  useEffect(() => {
    fetchEvaluations();
    fetchProfessionalDetails();
  }, []);

  useEffect(() => {
    if (selectedMonth) fetchEarnings(selectedMonth);
  }, [selectedMonth]);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const emptyStars = 5 - fullStars;

    return (
      <div className="flex space-x-1 text-yellow-500">
        {[...Array(fullStars)].map((_, i) => (
          <svg
            key={`full-${i}`}
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 .587l3.668 7.425 8.2 1.193-5.934 5.788 1.399 8.157-7.333-3.852-7.333 3.852 1.399-8.157-5.934-5.788 8.2-1.193z" />
          </svg>
        ))}
        {[...Array(emptyStars)].map((_, i) => (
          <svg
            key={`empty-${i}`}
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-300"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 .587l3.668 7.425 8.2 1.193-5.934 5.788 1.399 8.157-7.333-3.852-7.333 3.852 1.399-8.157-5.934-5.788 8.2-1.193z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Panel del Profesional</h1>

      {error && <p className="text-red-500">{error}</p>}

      {/* Detalles del Profesional */}
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Detalles del Profesional</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Nombre</span>
            <span className="text-lg font-medium text-gray-800">{details.professional_name || "No disponible"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Especialidad</span>
            <span className="text-lg font-medium text-gray-800">{details.specialty || "No disponible"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Correo</span>
            <span className="text-lg font-medium text-gray-800">{details.email || "No disponible"}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Teléfono</span>
            <span className="text-lg font-medium text-gray-800">{details.phone_number || "No disponible"}</span>
          </div>
          <div className="flex flex-col col-span-2">
            <span className="text-sm text-gray-500">Calificación Promedio</span>
            <div className="flex items-center">
              <span className="text-lg font-medium text-gray-800 mr-2">
                {parseInt(details.average_rating) || 0}
              </span>
              {renderStars(details.average_rating || 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Ganancias por Mes */}
      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-xl font-bold">Ganancias por Mes</h2>
        <label htmlFor="month" className="block text-sm font-medium">
          Seleccionar Mes
        </label>
        <select
          id="month"
          className="mt-1 block w-full p-2 border rounded"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">Seleccione un mes</option>
          <option value="1">Enero</option>
          <option value="2">Febrero</option>
          <option value="3">Marzo</option>
          <option value="4">Abril</option>
          <option value="5">Mayo</option>
          <option value="6">Junio</option>
          <option value="7">Julio</option>
          <option value="8">Agosto</option>
          <option value="9">Septiembre</option>
          <option value="10">Octubre</option>
          <option value="11">Noviembre</option>
          <option value="12">Diciembre</option>
        </select>
        <div className="mt-4">
          {earnings.map((earning) => (
            <div
              key={earning.professional_id}
              className="p-4 bg-gray-100 rounded shadow mb-2"
            >
              <p>
                <strong>Ganancias:</strong> ${earning.total_earnings}
              </p>
              <p>
                <strong>Fecha más reciente:</strong>{" "}
                {new Date(earning.latest_date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Evaluaciones del Profesional */}
      <div className="p-4 bg-white rounded shadow space-y-4">
        <h2 className="text-xl font-bold">Evaluaciones</h2>
        {evaluations.map((evaluation) => (
          <div
            key={evaluation.id}
            className="p-4 bg-gray-100 rounded shadow flex justify-between"
          >
            <div>
              <p>
                <strong>Paciente:</strong> {evaluation.patient.name}
              </p>
              <p>
                <strong>Comentario:</strong> {evaluation.comment}
              </p>
            </div>
            <div>
              <p>
                <strong>Calificación:</strong> {evaluation.rating}
              </p>
              <p>
                <strong>Fecha:</strong>{" "}
                {new Date(evaluation.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
