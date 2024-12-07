"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ResetPasswordForm from '@../../../components/Auth/ResetPasswordForm';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState(null);

  useEffect(() => {
    const queryToken = searchParams.get('token');
    setToken(queryToken);
  }, [searchParams]);

  // Renderiza un mensaje de carga mientras se obtiene el token
  if (!token) return <div>Cargando...</div>;

  return <ResetPasswordForm token={token} />;
}
