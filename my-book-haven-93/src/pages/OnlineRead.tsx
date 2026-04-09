import DashboardSidebar from "@/components/DashboardSidebar";
import TopSearchBar from "@/components/TopSearchBar";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";

const bookContent = [
  "It was a bright cold day in April, and the clocks were striking thirteen.",
  "Winston Smith, his chin nuzzled into his breast...",
  "The hallway smelt of boiled cabbage and old rag mats...",
];

export default function OnlineRead() {
  const [page, setPage] = useState(0);

  /* AUTH FIRST */
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

        <main className="p-6 max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Reading: 1984</h1>

          <div className="bg-white p-6 rounded-xl shadow leading-relaxed text-gray-700">
            {bookContent[page]}
          </div>

          <div className="flex justify-between mt-6">
            <button
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-[#424241]"
            >
              Previous
            </button>

            <button
              disabled={page === bookContent.length - 1}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 bg-[#926d24] text-white rounded disabled:opacity-50 hover:bg-[#674b13]"
            >
              Next
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}