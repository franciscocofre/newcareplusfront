export default function ProfessionalLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Panel Lateral */}
      <aside className="w-64 bg-[#2D4459] text-white flex flex-col">
        <div className="p-4 flex items-center">
          <img src="/logo1.png" alt="Logo" className="h-10 w-10 mr-2" />
          <h1 className="text-xl font-bold">Panel Profesional</h1>
        </div>
        <nav className="flex-grow">
          <ul className="space-y-2 px-4">
            <li>
              <a
                href="/professional"
                className="block p-2 rounded hover:bg-blue-700 transition"
              >
                Inicio
              </a>
            </li>
            <li>
              <a
                href="/professional/appointments"
                className="block p-2 rounded hover:bg-blue-700 transition"
              >
                Ver Citas
              </a>
            </li>
            <li>
              <a
                href="/professional/schedules"
                className="block p-2 rounded hover:bg-blue-700 transition"
              >
                Crear Horario
              </a>
            </li>
            <li>
              <a
                href="/professional/complaint"
                className="block p-2 rounded hover:bg-blue-700 transition"
              >
                Reclamos y Sugerencias
              </a>
            </li>
            <li>
              <a
                href="/professional/evaluations"
                className="block p-2 rounded hover:bg-blue-700 transition"
              >
                Mi panel
              </a>
            </li>
            <li>
              <a
                href="/"
                className="block p-2 rounded hover:bg-blue-700 transition"
              >
                Salir
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-grow p-5">{children}</main>
    </div>
  );
}
