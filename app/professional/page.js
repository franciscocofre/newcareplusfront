"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function ProfessionalDashboard() {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No se encontró un token válido. Por favor, inicie sesión.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://localhost:3001/api/users/info", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserInfo(response.data);
        setError("");
      } catch (err) {
        console.error("Error al cargar la información del usuario:", err);
        setError(
          err.response?.data?.error || "Hubo un problema al cargar la información."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) {
    return <p className="text-gray-500 text-center">Cargando información...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="container mx-auto p-6 flex justify-center">
      <div className="flex flex-col rounded-2xl w-full md:w-1/2 bg-white text-gray-800 shadow-lg">
        <div className="p-8">
          <h1 className="text-4xl font-bold text-center text-blue-900 mb-6">
            {userInfo.name}
          </h1>
          <div className="space-y-4">
            <div className="flex flex-row items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5"></path>
              </svg>
              <span>
                <strong>Especialidad:</strong> {userInfo.specialty || "No definida"}
              </span>
            </div>
            <div className="flex flex-row items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5"></path>
              </svg>
              <span>
                <strong>Correo:</strong> {userInfo.email}
              </span>
            </div>
            <div className="flex flex-row items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5"></path>
              </svg>
              <span>
                <strong>Teléfono:</strong> {userInfo.phone || "No registrado"}
              </span>
            </div>
            <div className="flex flex-row items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6 9 17l-5-5"></path>
              </svg>
              <span>
                <strong>Dirección:</strong> {userInfo.address || "No registrada"}
              </span>
            </div>
            {userInfo.role === "profesional" && (
              <div className="flex flex-row items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5"></path>
                </svg>
                <span>
                  <strong>Tarifa por hora:</strong> $
                  {userInfo.rate_per_hour || "No definida"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
