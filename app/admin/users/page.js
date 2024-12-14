"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import UserList from "./UserList";
import UserDetail from "./UserDetail";

export default function AdminUserPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState("");

  // Cargar todos los usuarios
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://newcareplusback.onrender.com/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
      setFilteredUsers(response.data); // Inicialmente mostrar todos
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      setError("No se pudieron cargar los usuarios.");
    }
  };

  // Filtrar usuarios por rol
  const handleFilterChange = (role) => {
    setSelectedRole(role);
    if (role === "all") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter((user) => user.role === role));
    }
  };

  // Seleccionar un usuario para editar
  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-5">Administración de Usuarios</h2>
      {error && <p className="text-red-500">{error}</p>}

      {/* Filtro de roles */}
      <div className="mb-5">
        <label className="block text-gray-700 font-bold mb-2">Filtrar por Rol:</label>
        <select
          value={selectedRole}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="p-2 border rounded w-60 bg-white shadow focus:outline-none focus:ring focus:border-blue-500"
        >
          <option value="all">Todos</option>
          <option value="admin">Administradores</option>
          <option value="profesional">Profesionales</option>
          <option value="paciente">Pacientes</option>
        </select>
      </div>

      {/* Lista de usuarios */}
      <UserList users={filteredUsers} onSelect={handleUserSelect} />

      {/* Detalle de usuario */}
      {selectedUser && (
        <UserDetail
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUpdate={() => fetchUsers()}
        />
      )}
    </div>
  );
}
