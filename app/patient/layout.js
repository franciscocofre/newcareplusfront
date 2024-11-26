export default function PatientLayout({ children }) { 
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Panel Lateral */}
      <aside className="w-64 bg-[#2D4459] text-white flex flex-col">
        <div className="p-4 flex items-center">
          <img src="/logo1.png" alt="Logo" className="h-10 w-10 mr-2" />
          <h1 className="text-xl font-bold">Panel Paciente</h1>
        </div>
        <nav className="flex-grow">
          <ul className="space-y-2 px-4">
            <li>
              <a
                href="/patient"
                className="block p-2 rounded hover:bg-blue-700 transition"
              >
                Inicio
              </a>
            </li>
            <li>
              <a
                href="/patient/appointment"
                className="block p-2 rounded hover:bg-blue-700 transition"
              >
                Agendar Cita
              </a>
            </li>
            <li>
              <a
                href="/patient/cancellations"
                className="block p-2 rounded hover:bg-blue-700 transition"
              >
                Cancelar una cita agendada
              </a>
            </li>
            <li>
              <a
                href="/patient/complaint"
                className="block p-2 rounded hover:bg-blue-700 transition"
              >
                Reclamos y Sugerencias
              </a>
            </li>
            <li>
              <a
                href="/patient/notifications"
                className="block p-2 rounded hover:bg-blue-700 transition flex justify-between items-center"
              >
                Notificaciones
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  3 {/* Este número puede ser dinámico basado en las notificaciones no leídas */}
                </span>
              </a>
            </li>
            <li>
              <a
                href="/patient/evaluations"
                className="block p-2 rounded hover:bg-blue-700 transition"
              >
                Evaluar Profesionales
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
