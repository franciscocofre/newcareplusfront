"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState(""); // Estado para almacenar el token
  const router = useRouter();
  const searchParams = useSearchParams(); // Hook para obtener parámetros de la URL

  useEffect(() => {
    const tokenFromParams = searchParams.get("token"); // Obtiene el token de los parámetros de la URL
    if (tokenFromParams) {
      setToken(tokenFromParams); // Almacena el token en el estado
    } else {
      setError("Token no encontrado en la URL.");
    }
  }, [searchParams]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      await axios.post("http://localhost:3001/api/auth/reset-password", {
        token,
        newPassword,
      });
      setMessage("Contraseña restablecida con éxito. Redirigiendo al inicio de sesión...");

      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (error) {
      console.error("Error al restablecer la contraseña:", error);
      setError(error.response?.data?.error || "Error al restablecer la contraseña.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl mb-6 text-center">Restablecer Contraseña</h2>
      <form onSubmit={handleResetPassword} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {message && <p className="text-green-500 text-xs italic mb-4">{message}</p>}
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Nueva Contraseña</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Confirmar Contraseña</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Restablecer Contraseña
        </button>
      </form>
    </div>
  );
}
