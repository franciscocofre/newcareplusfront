"use client";

// Importamos los hooks de React y el servicio de API
import { useState } from 'react';
import api from '../../services/api';
import { useRouter } from 'next/navigation';

const LoginForm = () => {
  // Definimos los estados para el email, password, error, y el enrutador de Next.js
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Función para manejar el envío del formulario de inicio de sesión
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Realizamos la solicitud de inicio de sesión con email y password
      const response = await api.post('/auth/login', { email, password });
      const { token, role } = response.data;
      // Guardamos el token en localStorage para futuras solicitudes autenticadas
      localStorage.setItem('token', token);

      // Redirigimos al usuario según su rol
      if (role === 'profesional') {
        router.push('/professional');
      } else if (role === 'paciente') {
        router.push('/patient');
      } else if (role === 'admin') {
        router.push('/admin');
      }
    } catch (error) {
      // En caso de error, mostramos el mensaje correspondiente
      const errorMessage = error.response?.data?.error || 'Error de conexión. Por favor, verifica el servidor.';
      setError(errorMessage);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      {/* Sección del logo en la parte superior del formulario */}
      <div className="flex justify-center mb-6">
        {/* Asegúrate de que el logo esté en la carpeta `public` y utiliza la ruta correcta */}
        <img src="/logo.png" alt="New Care Logo" className="w-240 h-240" />
      </div>

      {/* Formulario de inicio de sesión */}
      <form onSubmit={handleLogin} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl mb-6 text-center">Iniciar Sesión</h2>
        
        {/* Mensaje de error en caso de que ocurra uno */}
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        
        {/* Campo para el correo electrónico */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Correo Electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        {/* Campo para la contraseña */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        
        {/* Botón de envío para iniciar sesión */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Iniciar Sesión
          </button>
        </div>
        
        {/* Enlace para recuperar la contraseña */}
        <p className="text-center text-sm text-blue-500 mt-4">
          <a href="/auth/recover-password">¿Olvidaste tu contraseña?</a>
        </p>
      </form>
      
      {/* Enlace para redirigir al registro en caso de no tener cuenta */}
      <p className="text-sm text-center mt-4">
        ¿No tienes una cuenta? <a href="/auth/register" className="text-blue-500">Regístrate aquí</a>
      </p>
    </div>
  );
};

export default LoginForm;
