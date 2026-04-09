import DashboardSidebar from "@/components/DashboardSidebar";
import TopSearchBar from "@/components/TopSearchBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const books = [
  { title: "1984", due: "2026-04-15", status: "Due Soon" },
  { title: "Dune", due: "2026-04-01", status: "Overdue" },
];

export default function ReturnDeadline() {
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
    <div className="min-h-screen bg-[#F8F9FC]">
      <DashboardSidebar />
      <div className="lg:ml-[272px]">
        <TopSearchBar />

        <main className="p-6">
          <h1 className="text-2xl font-bold mb-4">Return Deadlines</h1>

          <div className="space-y-3">
            {books.map((book) => (
              <div
                key={book.title}
                className="p-4 bg-white rounded shadow flex justify-between"
              >
                <span>{book.title}</span>
                <span>{book.due}</span>
                <span
                  className={
                    book.status === "Overdue"
                      ? "text-red-500"
                      : "text-yellow-500"
                  }
                >
                  {book.status}
                </span>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}