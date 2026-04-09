import DashboardSidebar from "@/components/DashboardSidebar";
import TopSearchBar from "@/components/TopSearchBar";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";

const issuedBooks = [
  {
    id: 1,
    title: "The Hobbit",
    issueDate: "2026-04-01",
    returnDate: "2026-04-10",
  },
  {
    id: 2,
    title: "Pride and Prejudice",
    issueDate: "2026-04-05",
    returnDate: "2026-04-15",
  },
];

export default function Issued() {

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
          <h1 className="text-2xl font-bold mb-6">Issued Books</h1>

          <div className="space-y-4">
            {issuedBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white p-4 rounded-xl shadow flex justify-between"
              >
                <div>
                  <h2 className="font-semibold">{book.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    Issued: {book.issueDate}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Return: {book.returnDate}
                  </p>
                </div>

                <span className="text-[#926d24] font-medium">
                  Active
                </span>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}