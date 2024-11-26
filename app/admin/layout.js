export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Panel Lateral */}
      <aside
        className="w-64 bg-[#2D4459] text-white flex flex-col p-4 shadow-lg"
        style={{ minHeight: "100vh" }}
      >
        {/* Logo y Título */}
        <div className="flex items-center mb-6">
          <img
            src="/logo1.png"
            alt="Logo de la empresa"
            className="h-12 w-15 rounded-full mr-3"
          />
          <h1 className="text-xl font-bold">Administrador</h1>
        </div>

        {/* Enlaces de Navegación */}
        <ul className="space-y-4">
          <li>
            <a
              href="/admin"
              className="block py-2 px-4 rounded hover:bg-blue-500"
            >
              Inicio
            </a>
          </li>
          <li>
            <a
              href="/admin/users"
              className="block py-2 px-4 rounded hover:bg-blue-500"
            >
              Usuarios
            </a>
          </li>
          <li>
            <a
              href="/admin/appointments"
              className="block py-2 px-4 rounded hover:bg-blue-500"
            >
              Gestión de Citas
            </a>
          </li>
          <li>
            <a
              href="/admin/reports"
              className="block py-2 px-4 rounded hover:bg-blue-500"
            >
              Reportes
            </a>
          </li>
          <li>
            <a
              href="/admin/complaint"
              className="block py-2 px-4 rounded hover:bg-blue-500"
            >
              Reclamos
            </a>
          </li>
          <li>
            <a
              href="/"
              className="block py-2 px-4 rounded hover:bg-red-500"
            >
              Salir
            </a>
          </li>
        </ul>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
