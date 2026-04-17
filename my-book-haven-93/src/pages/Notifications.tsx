import DashboardSidebar from "@/components/DashboardSidebar";
import TopSearchBar from "@/components/TopSearchBar";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";

const notifications = [
  {
    id: 1,
    message: "Your book '1984' is due tomorrow.",
    type: "warning",
    time: "2 hours ago",
  },
  {
    id: 2,
    message: "New book 'Dune' is now available.",
    type: "info",
    time: "1 day ago",
  },
  {
    id: 3,
    message: "Payment successful for 'The Hobbit'.",
    type: "success",
    time: "3 days ago",
  },
];

export default function Notifications() {
  /* Check Login Cookie */
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/v1/verify", {
          method: "GET",
          credentials: "include", // 🔥 required for cookies
        });

        if (!res.ok) {
          navigate("/login");
        } else {
          setLoading(false);
        }
      } catch {
        navigate("/login");
      }
    };

    verifyUser();
  }, []);

  // 🔥 Prevent render until verified
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
            {notifications.map((note) => (
              <div
                key={note.id}
                className="bg-white p-4 rounded-xl shadow flex justify-between items-start"
              >
                {/* Left Content */}
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {note.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {note.time}
                  </p>
                </div>

                {/* Status Badge */}
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
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}