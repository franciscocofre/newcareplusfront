"use client";

import { useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendarStyles.css";

export default function PatientAppointmentPage() {
  const [specialties] = useState(["kinesiologo", "podologo", "terapeuta", "nutricionista"]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [professionals, setProfessionals] = useState([]);
  const [selectedProfessional, setSelectedProfessional] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null); // Para mostrar la confirmación

  // Buscar profesionales por especialidad
  const handleSearch = async () => {
    const token = localStorage.getItem("token");
    if (!selectedSpecialty) {
      setMessage("Selecciona una especialidad antes de buscar.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `https://newcareplusback.onrender.com/api/users/professionals/specialty?specialty=${selectedSpecialty}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfessionals(response.data.professionals);
      setMessage("");
    } catch (error) {
      console.error("Error al obtener profesionales:", error);
      setMessage("Error al obtener profesionales. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Obtener horarios disponibles para un profesional
  const fetchSchedules = async (professional_id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `https://newcareplusback.onrender.com/api/schedules/${professional_id}/available-schedules`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSchedules(response.data.schedules);
    } catch (error) {
      console.error("Error al obtener horarios:", error);
      setMessage("Error al obtener horarios.");
    }
  };

  // Seleccionar profesional y cargar horarios
  const handleProfessionalChange = (e) => {
    const professional_id = e.target.value;
    setSelectedProfessional(professional_id);
    if (professional_id) {
      fetchSchedules(professional_id);
    } else {
      setSchedules([]);
    }
  };

  // Validar fechas deshabilitadas en el calendario
  const tileDisabled = ({ date, view }) => {
    if (view === "month") {
      const dayHasAvailableSlots = schedules.some((schedule) => {
        const availableFrom = new Date(schedule.from);
        return date.toDateString() === availableFrom.toDateString();
      });
      return !dayHasAvailableSlots;
    }
  };

  // Manejar cambio de fecha seleccionada
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
  };

  // Filtrar horarios disponibles para la fecha seleccionada
  const availableTimeSlots = schedules
    .filter((schedule) => {
      const availableFrom = new Date(schedule.from);
      return (
        selectedDate &&
        availableFrom.toDateString() === selectedDate.toDateString()
      );
    })
    .map((schedule) => ({
      from: new Date(schedule.from),
      to: new Date(schedule.to),
    }));

  // Seleccionar un bloque horario
  const handleTimeSlotSelection = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  // Confirmar la cita
  const confirmAppointment = async (e) => {
    e.preventDefault();

    if (!selectedProfessional || !selectedTimeSlot) {
      setMessage("Selecciona un profesional, fecha y horario antes de confirmar.");
      return;
    }

    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://newcareplusback.onrender.com/api/appointments",
        {
          professional_id: selectedProfessional,
          scheduled_time: selectedTimeSlot.from,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Guardar datos de confirmación
      setConfirmationData(response.data.appointment);
      setMessage("Cita confirmada con éxito.");
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || "Error al confirmar la cita.";
      console.error("Error al confirmar la cita:", errorMsg);
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-screen-lg">
      <h2 className="text-3xl font-bold mb-8 text-center">Agendar Cita</h2>
      <div className="bg-white shadow-lg p-6 rounded-lg">
        <label className="block text-gray-700 mb-4">
          <span className="font-semibold">Selecciona una Especialidad:</span>
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="block w-full mt-1 rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Seleccione una especialidad</option>
            {specialties.map((specialty, index) => (
              <option key={index} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={handleSearch}
          disabled={loading}
          className={`mt-4 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-700"
          } text-white font-bold py-2 px-4 rounded`}
        >
          {loading ? "Buscando..." : "Buscar Profesionales"}
        </button>
      </div>

      {professionals.length > 0 && (
        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-4 text-center">
            Seleccione un Profesional
          </h3>
          <select
            value={selectedProfessional}
            onChange={handleProfessionalChange}
            className="block w-full mt-1 rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 mb-4"
          >
            <option value="">Seleccione un profesional</option>
            {professionals.map((professional) => (
              <option key={professional.id} value={professional.id}>
                {professional.name} - {professional.specialty}
              </option>
            ))}
          </select>

          {schedules.length > 0 && (
            <div className="bg-gray-100 p-6 rounded shadow">
              <h4 className="text-xl font-bold mb-2">Horarios Disponibles:</h4>
              <Calendar
                onChange={handleDateChange}
                tileDisabled={tileDisabled}
                className="react-calendar"
              />
            </div>
          )}

          {selectedDate && availableTimeSlots.length > 0 && (
            <div className="mt-4">
              <h4 className="text-lg font-bold">Seleccione una hora:</h4>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {availableTimeSlots.map((timeSlot, index) => (
                  <button
                    key={index}
                    onClick={() => handleTimeSlotSelection(timeSlot)}
                    className={`p-2 rounded ${
                      selectedTimeSlot === timeSlot
                        ? "bg-blue-600 text-white"
                        : "bg-gray-300"
                    } hover:bg-blue-400`}
                  >
                    {timeSlot.from.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -{" "}
                    {timeSlot.to.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedTimeSlot && (
            <button
              onClick={confirmAppointment}
              disabled={loading}
              className={`mt-4 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-700"
              } text-white font-bold py-2 px-4 rounded`}
            >
              {loading ? "Procesando..." : "Confirmar Cita"}
            </button>
          )}
        </div>
      )}
      {confirmationData && (
        <div className="bg-green-100 p-4 rounded mt-4">
          <h4 className="text-lg font-bold">Cita Confirmada</h4>
          <p><strong>ID:</strong> {confirmationData.id}</p>
          <p><strong>Profesional:</strong> {confirmationData.professional_id}</p>
          <p><strong>Horario:</strong> {new Date(confirmationData.scheduled_time).toLocaleString()}</p>
        </div>
      )}
      {message && <p className="text-red-500 mt-4">{message}</p>}
    </div>
  );
}
