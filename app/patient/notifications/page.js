"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:3001/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(response.data);
      } catch (error) {
        console.error("Error al obtener las notificaciones:", error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Notificaciones</h1>
      {notifications.map((notification) => (
        <div key={notification.id} className="bg-white p-4 rounded shadow mb-4">
          <h2 className="font-bold">{notification.title}</h2>
          <p>{notification.message}</p>
          <p className="text-gray-500 text-sm">
            {new Date(notification.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
