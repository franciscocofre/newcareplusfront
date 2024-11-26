// app/auth/reset-password/page.js
"use client";

import ResetPasswordForm from '@../../../components/Auth/ResetPasswordForm';

export default function ResetPasswordPage({ searchParams }) {
  return <ResetPasswordForm searchParams={searchParams} />;
}
