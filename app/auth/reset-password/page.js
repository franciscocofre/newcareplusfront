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

  // Si el token no está presente, muestra un mensaje amigable
  if (!token) return <div>No se encontró un token válido. Verifica el enlace.</div>;

  return <ResetPasswordForm token={token} />;
}
