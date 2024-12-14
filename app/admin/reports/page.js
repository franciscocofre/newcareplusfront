"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ReportsPage() {
  const [earningsByProfessional, setEarningsByProfessional] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [showTotalRevenue, setShowTotalRevenue] = useState(true);
  const [showEarningsByProfessional, setShowEarningsByProfessional] = useState(true);
  const [showChart, setShowChart] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        const [totalEarningsRes, totalRevenueRes] = await Promise.all([
          axios.get("https://newcareplusback.onrender.com/api/reports/total-earnings", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://newcareplusback.onrender.com/api/reports/total-revenue", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setEarningsByProfessional(totalEarningsRes.data?.earningsByProfessional || []);
        setTotalRevenue(totalRevenueRes.data?.totalRevenue || 0);
      } catch (error) {
        console.error("Error al obtener reportes:", error);
        setError("Error al obtener datos de reportes");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <p>Cargando reportes...</p>;
  if (error) return <p>{error}</p>;

  // Preparar datos para el gráfico de ingresos por profesional
  const earningsChartData = {
    labels: earningsByProfessional.map((prof) => prof.professional.name),
    datasets: [
      {
        label: "Ingresos Totales (CLP)",
        data: earningsByProfessional.map((prof) => parseFloat(prof.total_earnings)),
        backgroundColor: [
          "#4caf50", // Verde - Completada
          "#f44336", // Rojo - Cancelada
          "#ff9800", // Naranja - Pendiente
          "#ffeb3b", // Amarillo - Confirmada
        ],
      },
    ],
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Reportes Financieros
      </h2>

      {/* Botones para ocultar/mostrar secciones */}
      <div className="mb-6 flex justify-end space-x-4">
        <button
          onClick={() => setShowTotalRevenue(!showTotalRevenue)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          {showTotalRevenue ? "Ocultar Recaudación Total" : "Mostrar Recaudación Total"}
        </button>
        <button
          onClick={() => setShowEarningsByProfessional(!showEarningsByProfessional)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          {showEarningsByProfessional ? "Ocultar Ingresos Totales" : "Mostrar Ingresos Totales"}
        </button>
        <button
          onClick={() => setShowChart(!showChart)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          {showChart ? "Ocultar Gráfico" : "Mostrar Gráfico"}
        </button>
      </div>

      {/* Recaudación Total */}
      {showTotalRevenue && (
        <section className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-gray-700">Recaudación Total</h3>
          <div className="flex justify-center items-center">
            <div className="w-full md:w-1/2 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white p-6 rounded-lg shadow-lg">
              <h4 className="text-2xl font-bold text-center">Recaudación Total</h4>
              <p className="text-4xl font-semibold text-center mt-2">
                {totalRevenue.toLocaleString("es-CL", {
                  style: "currency",
                  currency: "CLP",
                })}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Ingresos Totales por Profesional */}
      {showEarningsByProfessional && (
        <section className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-gray-700">
            Ingresos Totales por Profesional
          </h3>
          <table className="w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-blue-200 text-left">
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Especialidad</th>
                <th className="px-4 py-2">Ingresos Totales</th>
              </tr>
            </thead>
            <tbody>
              {earningsByProfessional.map((prof) => (
                <tr key={prof.professional_id} className="border-b">
                  <td className="px-4 py-2">{prof.professional.name}</td>
                  <td className="px-4 py-2 capitalize">{prof.professional.specialty}</td>
                  <td className="px-4 py-2">
                    {parseFloat(prof.total_earnings).toLocaleString("es-CL", {
                      style: "currency",
                      currency: "CLP",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Gráfico de Ingresos */}
      {showChart && (
        <section className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-gray-700">Ingresos por Profesional</h3>
          <div className="w-full lg:w-2/3 mx-auto">
            <Bar
              data={earningsChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                  title: {
                    display: true,
                    text: "Ingresos por Profesional (CLP)",
                  },
                },
              }}
            />
          </div>
        </section>
      )}
    </div>
  );
}
