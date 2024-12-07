"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ResetPasswordForm from '@../../../components/Auth/ResetPasswordForm';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const [queryParams, setQueryParams] = useState(null);

  useEffect(() => {
    setQueryParams(searchParams.get('token')); // Obtén el token desde los parámetros de consulta
  }, [searchParams]);

  // Renderizar un mensaje de carga mientras se obtienen los parámetros
  if (!queryParams) return <div>Cargando...</div>;

  // Pasa el token al formulario de restablecimiento de contraseña
  return <ResetPasswordForm token={queryParams} />;
}
