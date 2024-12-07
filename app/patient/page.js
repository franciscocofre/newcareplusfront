"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import "./profile.css"; // Reutilizamos el mismo CSS estilizado

export default function PatientDashboard() {
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
        const response = await axios.get("https://newcareback-hhcsb3era0gwctg3.centralus-01.azurewebsites.net/api/users/info", {
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
    <div className="container">
      <div className="card">
        <h1 className="card-title">{userInfo.name}</h1>
        <div className="card-details">
          <div className="detail-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="detail-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5"></path>
            </svg>
            <span className="detail-text">
              <strong>Correo:</strong> {userInfo.email}
            </span>
          </div>
          <div className="detail-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="detail-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5"></path>
            </svg>
            <span className="detail-text">
              <strong>Teléfono:</strong> {userInfo.phone || "No registrado"}
            </span>
          </div>
          <div className="detail-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="detail-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6 9 17l-5-5"></path>
            </svg>
            <span className="detail-text">
              <strong>Dirección:</strong> {userInfo.address || "No registrada"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
