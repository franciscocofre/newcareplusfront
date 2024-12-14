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

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [topProfessionals, setTopProfessionals] = useState([]);
  const [professionalsAvailability, setProfessionalsAvailability] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        const [availabilityRes, topProfessionalsRes] = await Promise.all([
          axios.get("https://newcareplusback.onrender.com/api/reports/top-availability", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://newcareplusback.onrender.com/api/reports/top-professionals", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setProfessionalsAvailability(availabilityRes?.data?.professionalsByAvailability || []);
        setTopProfessionals(topProfessionalsRes?.data?.topProfessionals || []);
      } catch (error) {
        console.error("Error general al obtener reportes:", error);
        setError("Error al obtener datos de reportes");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Cargando reportes...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  // Preparar datos para el gráfico de disponibilidad
  const availabilityChartData = {
    labels: professionalsAvailability.map((prof) => prof.professional.name),
    datasets: [
      {
        label: "Horas Disponibles",
        data: professionalsAvailability.map((prof) => Math.floor(prof.total_available_hours)),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-8 text-center">Gestión de Citas</h2>

      {/* Gráfico de disponibilidad */}
      <section className="mb-12">
        <h3 className="text-xl font-bold mb-6 text-center">
          Profesionales con Más Disponibilidad
        </h3>
        <div className="flex justify-center">
          <div className="w-full md:w-2/3">
            <Bar
              data={availabilityChartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                  title: { display: true, text: "Disponibilidad de Profesionales en Horas" },
                },
              }}
            />
          </div>
        </div>
      </section>

      {/* Top 5 Profesionales */}
      <section className="mb-12">
        <h3 className="text-xl font-bold mb-6 text-center">
          Top 5 Profesionales por Citas Completadas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(topProfessionals || []).slice(0, 5).map((prof) => (
            <div
              key={prof.professional_id}
              className="bg-white shadow-lg rounded-lg p-6 border-t-4 border-blue-500"
            >
              <h4 className="text-lg font-semibold text-gray-700">
                {prof.professional.name}
              </h4>
              <p className="text-gray-600">Citas completadas: {prof.completed_appointments}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Detalles de citas */}
      <section>
        <h3 className="text-xl font-bold mb-6 text-center">Detalles de las Citas</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="py-3 px-6 text-left">Profesional</th>
                <th className="py-3 px-6 text-left">Horas Disponibles</th>
              </tr>
            </thead>
            <tbody>
              {(professionalsAvailability || []).map((prof) => (
                <tr
                  key={prof.professional_id}
                  className="border-b hover:bg-gray-100 transition"
                >
                  <td className="py-3 px-6">{prof.professional.name}</td>
                  <td className="py-3 px-6">{Math.floor(prof.total_available_hours)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
