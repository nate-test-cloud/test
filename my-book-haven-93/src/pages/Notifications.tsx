import DashboardSidebar from "@/components/DashboardSidebar";
import TopSearchBar from "@/components/TopSearchBar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/v1/verify", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          navigate("/login");
          return;
        }

        const notifRes = await fetch("http://localhost:5000/api/v1/notifications", {
          method: "GET",
          credentials: "include",
        });

        if (notifRes.ok) {
          const data = await notifRes.json();
          setNotifications(data);
        }

        setLoading(false);
      } catch {
        navigate("/login");
      }
    };

    fetchData();
  }, []);

  const markAsRead = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/v1/notifications/${id}/read`, {
        method: "PUT",
        credentials: "include",
      });
      // Update local state
      setNotifications(notifications.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      ));
    } catch (error) {
      console.error("Error marking notification as read");
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <DashboardSidebar />

      <div className="lg:ml-[272px] relative z-10">
        <TopSearchBar />

        <main className="p-6">
          <h1 className="text-2xl font-bold mb-6">Notifications</h1>

          <div className="space-y-4">
            {notifications.length === 0 ? (
              <p className="text-muted-foreground">No notifications</p>
            ) : (
              notifications.map((note) => (
                <div
                  key={note.id}
                  className={`bg-white p-4 rounded-xl shadow flex justify-between items-start ${
                    !note.read ? "border-l-4 border-primary" : ""
                  }`}
                >
                  {/* Left Content */}
                  <div className="flex-1">
                    <p className={`text-sm font-medium text-foreground ${!note.read ? "font-semibold" : ""}`}>
                      {note.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTime(note.created_at)}
                    </p>
                  </div>

                  {/* Status Badge and Mark as Read */}
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${
                        note.type === "success"
                          ? "bg-green-100 text-green-600"
                          : note.type === "warning"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {note.type}
                    </span>
                    {!note.read && (
                      <button
                        onClick={() => markAsRead(note.id)}
                        className="text-xs text-primary hover:underline"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}