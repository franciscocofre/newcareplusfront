// app/layout.js
import '../styles/globals.css'; // Ruta correcta según tu estructura

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-gray-100 min-h-screen ">
        {children}
      </body>
    </html>
  );
}
