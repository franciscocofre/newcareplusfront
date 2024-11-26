"use client";

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push('/auth/login');
  };

  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen bg-gray-100">
      
      {/* Imagen de fondo centrada, sin repetición y tamaño ajustado */}
      <div
        className="absolute inset-0 bg-center opacity-20"
        style={{
          backgroundImage: "url('/logo1.png')",
          backgroundSize: "70%", // Ajuste de tamaño de imagen
          backgroundPosition: "center", // Centrar imagen
          backgroundRepeat: "no-repeat" // Evitar repetición
        }}
      ></div>

      {/* Contenido en el frente */}
      <div className="relative z-10 text-center">
        <h1 className="text-4xl font-bold mb-8" style={{ color: '#2D4459' }}>
          Bienvenido a New Care
        </h1>
        <button
          onClick={handleLoginRedirect}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Iniciar Sesión
        </button>
      </div>
    </div>
  );
}
