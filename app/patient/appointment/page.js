"use client";

import { useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendarStyles.css";

export default function PatientAppointmentPage() {
  const [specialties, setSpecialties] = useState([
    "kinesiologo",
    "podologo",
    "terapeuta",
    "nutricionista",
  ]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [professionals, setProfessionals] = useState([]);
  const [selectedProfessional, setSelectedProfessional] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const token = localStorage.getItem("token");
    if (!selectedSpecialty) {
      setMessage("Selecciona una especialidad antes de buscar.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `https://newcareback-hhcsb3era0gwctg3.centralus-01.azurewebsites.net/api/users/professionals/specialty?specialty=${selectedSpecialty}`,
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

  const fetchSchedules = async (professional_id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `https://newcareback-hhcsb3era0gwctg3.centralus-01.azurewebsites.net/api/schedules/${professional_id}/available-schedules`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSchedules(response.data.schedules);
    } catch (error) {
      console.error("Error al obtener horarios:", error);
      setMessage("Error al obtener horarios.");
    }
  };

  const handleProfessionalChange = (e) => {
    const professional_id = e.target.value;
    setSelectedProfessional(professional_id);
    if (professional_id) {
      fetchSchedules(professional_id);
    } else {
      setSchedules([]);
    }
  };

  const tileDisabled = ({ date, view }) => {
    if (view === "month") {
      const dayHasAvailableSlots = schedules.some((schedule) => {
        const availableFrom = new Date(schedule.from);
        return date.toDateString() === availableFrom.toDateString();
      });
      return !dayHasAvailableSlots;
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
  };

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

  const handleTimeSlotSelection = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  const confirmAppointment = async (e) => {
    e.preventDefault();

    if (!selectedProfessional || !selectedTimeSlot) {
      setMessage("Selecciona un profesional, fecha y horario antes de confirmar.");
      return;
    }

    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      // Crear la cita y obtener su ID
      const appointmentResponse = await axios.post(
        "https://newcareback-hhcsb3era0gwctg3.centralus-01.azurewebsites.net/api/appointments",
        {
          professional_id: selectedProfessional,
          scheduled_time: selectedTimeSlot.from,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { id } = appointmentResponse.data.appointment;

      if (!id) {
        throw new Error("Error al obtener el ID de la cita.");
      }

      // Solicitar link de pago con Flow
      const paymentResponse = await axios.post(
        "https://newcareback-hhcsb3era0gwctg3.centralus-01.azurewebsites.net/api/payments/create-payment-link",
        { appointment_id: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Redirigir al link de pago generado
      if (paymentResponse.data.paymentLink) {
        window.location.href = paymentResponse.data.paymentLink;
      } else {
        setMessage("No se pudo generar el link de pago. Intenta nuevamente.");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || "Error al procesar el pago.";
      console.error("Error al procesar el pago:", errorMsg);
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
      {message && <p className="text-red-500 mt-4">{message}</p>}
    </div>
  );
}
