// components/auth/RecoverPasswordForm.js

"use client";

import { useState } from 'react';
import axios from 'axios';

export default function RecoverPasswordForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRecoverPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await axios.post('http://localhost:3001/api/auth/recover-password', { email });
      setMessage('Correo de recuperación enviado. Revisa tu bandeja de entrada.');
    } catch (error) {
      setError(error.response?.data?.error || 'Error al enviar correo de recuperación.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl mb-6 text-center">Recuperar Contraseña</h2>
      <form onSubmit={handleRecoverPassword} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {message && <p className="text-green-500 text-xs italic mb-4">{message}</p>}
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        
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
        
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}
