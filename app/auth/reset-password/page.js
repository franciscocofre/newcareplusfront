"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ResetPasswordForm from '@../../../components/Auth/ResetPasswordForm';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const [queryParams, setQueryParams] = useState(null);

  useEffect(() => {
    setQueryParams(searchParams);
  }, [searchParams]);

  // Evitar renderizado hasta que los parámetros estén listos
  if (!queryParams) return null;

  return <ResetPasswordForm searchParams={queryParams} />;
}
