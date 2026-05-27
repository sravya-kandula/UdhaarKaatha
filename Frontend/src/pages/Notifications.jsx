import { useEffect, useState } from "react";

import API from "../services/api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const [loading, setLoading] = useState(true);

  // FETCH NOTIFICATIONS
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await API.get("/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications(data.notifications);

      setLoading(false);
    } catch (error) {
      console.log(error);

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Loading Notifications...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 p-8">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800">Notifications</h1>

        <p className="text-gray-500 mt-2">
          Payment reminders and overdue alerts
        </p>
      </div>

      {/* NOTIFICATIONS */}
      <div className="space-y-6">
        {notifications.map((notification) => (
          <div
            key={notification._id}
            className="bg-white rounded-3xl shadow-lg p-6 border-l-8 border-orange-500"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {notification.title}
                </h2>

                <p className="text-gray-600 mt-2">{notification.message}</p>

                <p className="text-sm text-gray-400 mt-3">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>

              <div>
                <span className="px-5 py-2 rounded-full bg-red-100 text-red-600 font-semibold">
                  {notification.type || "alert"}
                </span>
              </div>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="bg-white rounded-3xl shadow-lg p-10 text-center">
            <h2 className="text-2xl font-bold text-gray-700">
              No Notifications
            </h2>

            <p className="text-gray-500 mt-2">Everything looks good 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
}
