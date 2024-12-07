"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import ResetPasswordForm from '@../../../components/Auth/ResetPasswordForm';

function ResetPasswordPageContent() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState(null);

  useEffect(() => {
    const queryToken = searchParams.get('token');
    setToken(queryToken);
  }, [searchParams]);

  if (!token) return <div>Cargando...</div>;

  return <ResetPasswordForm token={token} />;
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Cargando página...</div>}>
      <ResetPasswordPageContent />
    </Suspense>
  );
}
