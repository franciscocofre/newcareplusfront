import ResetPasswordForm from '@../../../components/Auth/ResetPasswordForm';

export async function getServerSideProps(context) {
  const { query } = context;

  // Verifica si existe el token
  if (!query.token) {
    return {
      notFound: true, // Devuelve una página 404 si no hay token
    };
  }

  return {
    props: {
      token: query.token, // Pasa el token como prop al componente
    },
  };
}

export default function ResetPasswordPage({ token }) {
  return <ResetPasswordForm token={token} />;
}
