import DashboardSidebar from "@/components/DashboardSidebar";
import TopSearchBar from "@/components/TopSearchBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ReturnDeadline() {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

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

        const issuedRes = await fetch("http://localhost:5000/api/v1/issued", {
          method: "GET",
          credentials: "include",
        });

        if (issuedRes.ok) {
          const data = await issuedRes.json();
          // Filter to show only online borrowed books (mode: "online")
          const onlineBooks = data.filter((book: any) => book.mode === "online");
          setIssuedBooks(onlineBooks);
        }

        setLoading(false);
      } catch {
        navigate("/login");
      }
    };

    fetchData();
  }, [navigate]);

  // Live countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, []);

  const getStatus = (returnDate: string) => {
    const today = new Date();
    const returnDateObj = new Date(returnDate);
    const diffTime = returnDateObj - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { status: "Overdue", color: "text-red-500" };
    if (diffDays <= 3) return { status: "Due Soon", color: "text-yellow-500" };
    return { status: "Active", color: "text-green-500" };
  };

  const getDaysRemaining = (returnDate: string) => {
    const today = new Date();
    const returnDateObj = new Date(returnDate);
    const diffTime = returnDateObj - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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
          <h1 className="text-2xl font-bold mb-4">Return Deadlines (Borrowed Books)</h1>

          <div className="space-y-3">
            {issuedBooks.length === 0 ? (
              <p className="text-muted-foreground">No borrowed books</p>
            ) : (
              issuedBooks.map((book) => {
                const { status, color } = getStatus(book.return_date);
                const daysRemaining = getDaysRemaining(book.return_date);
                return (
                  <div
                    key={book.id}
                    className="p-4 bg-white rounded-xl shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                  >
                    <div className="flex items-start gap-4 flex-grow">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-12 h-16 object-cover rounded flex-shrink-0"
                      />
                      <div className="flex-grow">
                        <h3 className="font-semibold text-lg">{book.title}</h3>
                        <p className="text-sm text-muted-foreground">by {book.author}</p>
                        <div className="text-xs text-muted-foreground mt-2 space-y-1">
                          <p>📅 Borrowed: {book.issue_date}</p>
                          <p>📅 Due: {book.return_date}</p>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-sm text-muted-foreground">Days Remaining</p>
                      <p className={`text-2xl font-bold ${color}`}>
                        {daysRemaining}
                      </p>
                      <p className={`text-xs font-semibold ${color} mt-1`}>
                        {status}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
    </div>
  );
}