"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

export default function PatientComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No se encontró un token válido. Por favor, inicie sesión.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:3001/api/complaints", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComplaints(response.data);
        setError("");
      } catch (err) {
        console.error("Error al obtener los reclamos:", err);
        setError(
          err.response?.data?.error ||
            "No se pudieron cargar los reclamos. Intenta nuevamente."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  if (loading) {
    return <p className="text-gray-500 text-center">Cargando reclamos...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-900">Mis Reclamos</h1>
        <Link href="/patient/complaint/new">
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Nuevo Reclamo
          </button>
        </Link>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        {complaints.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {complaints.map((complaint) => (
              <li key={complaint.id} className="py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-bold text-gray-700">
                      {complaint.title}
                    </h2>
                    <p className="text-gray-500">{complaint.description}</p>
                    <p className="text-sm text-blue-600 mt-2">
                      Estado:{" "}
                      <span
                        className={`${
                          complaint.status === "resolved"
                            ? "text-green-500"
                            : "text-yellow-500"
                        }`}
                      >
                        {complaint.status === "resolved"
                          ? "Resuelto"
                          : "Pendiente"}
                      </span>
                    </p>
                  </div>
                </div>
                {complaint.response && (
                  <div className="mt-4 bg-gray-100 p-3 rounded">
                    <p className="font-semibold text-gray-600">
                      Respuesta del Administrador:
                    </p>
                    <p className="text-gray-700">{complaint.response}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">
            No has registrado ningún reclamo aún.
          </p>
        )}
      </div>
    </div>
  );
}
