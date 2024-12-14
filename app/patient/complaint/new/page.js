"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function NewComplaintPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      setError("El título y la descripción son obligatorios.");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "https://newcareplusback.onrender.com/api/complaints",
        { title, description },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccessMessage("Reclamo enviado exitosamente.");
      setTitle("");
      setDescription("");

      // Redirige después de 2 segundos
      setTimeout(() => {
        router.push("/patient/complaint");
      }, 2000);
    } catch (err) {
      console.error("Error al enviar el reclamo:", err);
      setError(
        err.response?.data?.error || "Hubo un problema al enviar el reclamo."
      );
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">
        Nuevo Reclamo
      </h1>
      {error && (
        <p className="text-red-500 text-center mb-4">{error}</p>
      )}
      {successMessage && (
        <p className="text-green-500 text-center mb-4">{successMessage}</p>
      )}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-gray-700 font-bold mb-2"
          >
            Título del Reclamo
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Escribe el título del reclamo"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 font-bold mb-2"
          >
            Descripción
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Escribe la descripción detallada de tu reclamo"
            rows="4"
          />
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Enviar Reclamo
          </button>
          <button
            type="button"
            onClick={() => router.push("/patient/complaint")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
