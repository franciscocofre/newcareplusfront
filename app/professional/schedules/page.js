"use client";

import { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./calendarStyles.css";

export default function ProfessionalSchedulePage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimes, setSelectedTimes] = useState([]); // Almacena múltiples horarios seleccionados
  const [availableTimes, setAvailableTimes] = useState([]);
  const [message, setMessage] = useState("");

  const generateTimes = () => {
    const times = [];
    const startHour = 9; // 9:00 AM
    const endHour = 18; // 6:00 PM
    for (let hour = startHour; hour < endHour; hour++) {
      times.push(`${hour.toString().padStart(2, "0")}:00`);
      times.push(`${hour.toString().padStart(2, "0")}:40`);
    }
    setAvailableTimes(times);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    generateTimes();
  };

  const handleTimeSelect = (time) => {
    if (selectedTimes.includes(time)) {
      setSelectedTimes(selectedTimes.filter((t) => t !== time));
    } else {
      setSelectedTimes([...selectedTimes, time]);
    }
  };

  const createSchedule = async (e) => {
    e.preventDefault();
    if (!selectedDate || selectedTimes.length === 0) {
      setMessage("Selecciona una fecha y al menos un horario disponible.");
      return;
    }

    const date = selectedDate.toISOString().split("T")[0];
    const formattedTimes = selectedTimes.map((time) => `${date}T${time}:00`);

    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:3001/api/schedules",
        { date, times: formattedTimes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Horario creado con éxito");
      setSelectedTimes([]);
    } catch (error) {
      setMessage("Error al crear el horario");
    }
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <h2 className="text-4xl font-bold text-center mb-8 text-blue-600">
        Crear Horario de Disponibilidad
      </h2>
      {message && (
        <p className={`text-center mb-4 ${message.includes("éxito") ? "text-green-500" : "text-red-500"}`}>
          {message}
        </p>
      )}

      <div className="bg-white shadow-lg p-6 rounded-lg">
        <label className="block text-gray-700 mb-4">
          <span className="font-semibold">Selecciona un Día:</span>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            minDate={new Date()}
            className="mt-2 block w-full p-2 border rounded shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholderText="Selecciona una fecha"
          />
        </label>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Selecciona Horarios Disponibles:</label>
          <div className="grid grid-cols-4 gap-2">
            {availableTimes.map((time) => (
              <button
                key={time}
                type="button"
                className={`p-2 rounded ${
                  selectedTimes.includes(time)
                    ? "bg-blue-500 text-white shadow-lg transform scale-105"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
                onClick={() => handleTimeSelect(time)}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={createSchedule}
          className="w-full bg-green-500 text-white font-bold py-3 rounded shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition transform hover:scale-105"
        >
          Publicar Horario
        </button>
      </div>
    </div>
  );
}
