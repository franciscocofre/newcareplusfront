import { useState } from "react";
import axios from "axios";

export default function UserDetail({ user, onClose, onUpdate }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3001/api/users/${user.id}`,
        { name, email, role },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      setError("No se pudo actualizar el usuario.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-2xl font-bold mb-4">Editar Usuario</h3>
        {error && <p className="text-red-500">{error}</p>}
        <label className="block mb-2 text-gray-700">
          Nombre:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded mt-1"
          />
        </label>
        <label className="block mb-2 text-gray-700">
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mt-1"
          />
        </label>
        <label className="block mb-4 text-gray-700">
          Rol:
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border rounded mt-1"
          >
            <option value="admin">Administrador</option>
            <option value="profesional">Profesional</option>
            <option value="paciente">Paciente</option>
          </select>
        </label>
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Cancelar
          </button>
          <button
            onClick={handleUpdate}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
