export default function AdminHomePage() {
  const adminName = "Administrador"; // Aquí podrías obtener dinámicamente el nombre si está disponible

  return (
    <div>
      <h2 className="text-3xl font-bold">Bienvenido, {adminName}</h2>
      <p>Utilice el menú para ver reportes y gestionar la plataforma.</p>
    </div>
  );
}
