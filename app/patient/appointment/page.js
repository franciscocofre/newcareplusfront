"use client";

import { useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendarStyles.css";

export default function PatientAppointmentPage() {
  const [specialties, setSpecialties] = useState(["kinesiologo", "podologo", "terapeuta", "nutricionista"]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [professionals, setProfessionals] = useState([]);
  const [selectedProfessional, setSelectedProfessional] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [message, setMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState(null);
  const [selectedProfessionalDetails, setSelectedProfessionalDetails] = useState(null);

  const handleSearch = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `https://newcareplusback.onrender.com/api/users/professionals/specialty?specialty=${selectedSpecialty}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const professionalsWithSchedules = await Promise.all(
        response.data.professionals.map(async (professional) => {
          const schedules = await fetchSchedules(professional.id);
          return schedules.length > 0 ? professional : null;
        })
      );

      setProfessionals(professionalsWithSchedules.filter(Boolean));
      setMessage("");
    } catch (error) {
      console.error("Error al obtener profesionales:", error);
      setMessage("Error al obtener profesionales. Intenta nuevamente.");
    }
  };

  const fetchSchedules = async (professional_id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `https://newcareplusback.onrender.com/api/schedules/${professional_id}/available-schedules`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSchedules(response.data.schedules);
      if (response.data.schedules.length === 0) {
        setMessage("No se encontraron horarios disponibles para este profesional.");
      } else {
        setMessage("");
      }
      return response.data.schedules;
    } catch (error) {
      const errorMsg = error?.response?.data?.error || "Error desconocido al obtener horarios";
      console.error("Error al obtener horarios:", errorMsg);
      setMessage(errorMsg);
      return [];
    }
  };

  const handleProfessionalChange = (e) => {
    const professional_id = e.target.value;
    if (professional_id) {
      setSelectedProfessional(professional_id);
      const selectedProfessional = professionals.find((prof) => prof.id === parseInt(professional_id));
      setSelectedProfessionalDetails(selectedProfessional); // Guarda detalles del profesional seleccionado
      fetchSchedules(professional_id);
    } else {
      setSelectedProfessional("");
      setSelectedProfessionalDetails(null);
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
      return selectedDate && availableFrom.toDateString() === selectedDate.toDateString();
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
      setMessage("Asegúrate de seleccionar un profesional, fecha y horario válidos.");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "https://newcareplusback.onrender.com/api/appointments",
        { professional_id: parseInt(selectedProfessional), scheduled_time: selectedTimeSlot.from },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowPopup(true);
      setAppointmentDetails(response.data.appointment);
      setMessage("");
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Error al agendar la cita";
      console.error("Error al crear la cita:", errorMsg);
      setMessage(errorMsg);
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
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Buscar Profesionales
        </button>
      </div>

      {professionals.length > 0 && (
        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-4 text-center">Seleccione un Profesional</h3>
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
                      selectedTimeSlot === timeSlot ? "bg-blue-600 text-white" : "bg-gray-300"
                    } hover:bg-blue-400`}
                  >
                    {timeSlot.from.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                    {timeSlot.to.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedTimeSlot && (
            <button
              onClick={confirmAppointment}
              className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Confirmar Cita
            </button>
          )}
        </div>
      )}

      {showPopup && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 shadow-lg max-w-md">
            <h3 className="text-lg font-bold mb-4">Cita Confirmada</h3>
            <p>
              <strong>Médico:</strong> {selectedProfessionalDetails?.name || "Desconocido"}
            </p>
            <p>
              <strong>Especialidad:</strong> {selectedProfessionalDetails?.specialty || "Desconocido"}
            </p>
            <p>
              <strong>Fecha:</strong>{" "}
              {new Date(appointmentDetails.scheduled_time).toLocaleDateString()}
            </p>
            <p>
              <strong>Hora:</strong>{" "}
              {new Date(appointmentDetails.scheduled_time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
            <button
              onClick={() => (window.location.href = "/patient")}
              className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
