import DashboardSidebar from "@/components/DashboardSidebar";
import TopSearchBar from "@/components/TopSearchBar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Issued() {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchIssuedBooks = async () => {
    try {
      const purchasesRes = await fetch("http://localhost:5000/api/v1/purchases", {
        method: "GET",
        credentials: "include",
      });

      if (purchasesRes.ok) {
        const data = await purchasesRes.json();
        setIssuedBooks(data);
      }
    } catch (error) {
      console.error("Error fetching purchase history:", error);
    }
  };

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

        await fetchIssuedBooks();
        setLoading(false);
      } catch {
        navigate("/login");
      }
    };

    fetchData();
  }, [navigate]);

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
          <h1 className="text-2xl font-bold mb-6">Purchase History</h1>
          <p className="text-muted-foreground mb-6">
            Review the books you have purchased so far.
          </p>

          <div className="space-y-4">
            {issuedBooks.length === 0 ? (
              <p className="text-muted-foreground">No purchases yet</p>
            ) : (
              issuedBooks.map((book) => (
                <div
                  key={book.id}
                  className="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row justify-between items-start gap-4"
                >
                  <div className="flex items-start gap-4 flex-grow">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-16 h-24 object-cover rounded flex-shrink-0"
                    />
                    <div>
                      <h2 className="font-semibold text-lg">{book.title}</h2>
                      <p className="text-sm text-muted-foreground">by {book.author}</p>
                      {book.quantity && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Quantity: {book.quantity}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground mt-1">
                        Purchased: {new Date(book.purchase_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total Paid</p>
                    <p className="text-xl font-semibold">₹{book.price}</p>
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