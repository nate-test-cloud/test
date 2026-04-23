import DashboardSidebar from "@/components/DashboardSidebar";
import TopSearchBar from "@/components/TopSearchBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ReturnDeadline() {
  const [issuedBooks, setIssuedBooks] = useState([]);
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

        const issuedRes = await fetch("http://localhost:5000/api/v1/issued", {
          method: "GET",
          credentials: "include",
        });

        if (issuedRes.ok) {
          const data = await issuedRes.json();
          setIssuedBooks(data);
        }

        setLoading(false);
      } catch {
        navigate("/login");
      }
    };

    fetchData();
  }, []);

  const getStatus = (returnDate) => {
    const today = new Date();
    const returnDateObj = new Date(returnDate);
    const diffTime = returnDateObj - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { status: "Overdue", color: "text-red-500" };
    if (diffDays <= 3) return { status: "Due Soon", color: "text-yellow-500" };
    return { status: "Active", color: "text-green-500" };
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
          <h1 className="text-2xl font-bold mb-4">Return Deadlines</h1>

          <div className="space-y-3">
            {issuedBooks.length === 0 ? (
              <p className="text-muted-foreground">No issued books</p>
            ) : (
              issuedBooks.map((book) => {
                const { status, color } = getStatus(book.return_date);
                return (
                  <div
                    key={book.id}
                    className="p-4 bg-white rounded shadow flex justify-between items-center gap-4"
                  >
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-10 h-14 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-grow">
                      <span className="font-medium">{book.title}</span>
                      <p className="text-sm text-muted-foreground">by {book.author}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="block text-sm">{book.return_date}</span>
                      <span className={`text-sm font-medium ${color}`}>
                        {status}
                      </span>
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