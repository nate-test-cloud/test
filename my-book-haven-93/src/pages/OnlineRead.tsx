import DashboardSidebar from "@/components/DashboardSidebar";
import TopSearchBar from "@/components/TopSearchBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

export default function OnlineRead() {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
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
          // Filter to show only online borrowed books
          const onlineBooks = data.filter((book: any) => book.mode === "online");
          setBorrowedBooks(onlineBooks);
        }

        setLoading(false);
      } catch {
        navigate("/login");
      }
    };

    verifyUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Reader view - show content of selected book
  if (selectedBook) {
    const bookContent = selectedBook.content || "No content available for this book.";
    const contentPages = bookContent.split("\n\n").filter((p: string) => p.trim());

    return (
      <div className="min-h-screen bg-background relative">
        <DashboardSidebar />

        <div className="lg:ml-[272px] relative z-10">
          <TopSearchBar />

          <main className="p-6 max-w-4xl mx-auto">
            <button
              onClick={() => {
                setSelectedBook(null);
                setCurrentPage(0);
              }}
              className="flex items-center gap-2 mb-6 text-muted-foreground hover:text-foreground transition"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Library
            </button>

            <div className="bg-white rounded-xl shadow p-8">
              <h1 className="text-3xl font-bold mb-2">{selectedBook.title}</h1>
              <p className="text-lg text-muted-foreground mb-6">by {selectedBook.author}</p>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg mb-6 leading-relaxed text-gray-700 min-h-96">
                {contentPages[currentPage] || "No more content available."}
              </div>

              <div className="flex justify-between items-center">
                <button
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition"
                >
                  <ChevronLeft className="h-5 w-5" />
                  Previous
                </button>

                <span className="text-sm text-muted-foreground">
                  Page {currentPage + 1} of {contentPages.length}
                </span>

                <button
                  disabled={currentPage === contentPages.length - 1}
                  onClick={() => setCurrentPage(Math.min(currentPage + 1, contentPages.length - 1))}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 transition"
                >
                  Next
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Library view - show list of borrowed books
  return (
    <div className="min-h-screen bg-background relative">
      <DashboardSidebar />

      <div className="lg:ml-[272px] relative z-10">
        <TopSearchBar />

        <main className="p-6">
          <h1 className="text-2xl font-bold mb-2">Online Library</h1>
          <p className="text-muted-foreground mb-6">
            Click on a book to start reading. You have access to these books for 14 days.
          </p>

          {borrowedBooks.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-12 text-center">
              <p className="text-lg text-muted-foreground mb-4">
                No borrowed books yet. Purchase books in online mode to read them here!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {borrowedBooks.map((book) => (
                <div
                  key={book.id}
                  onClick={() => setSelectedBook(book)}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer overflow-hidden group"
                >
                  <div className="aspect-[2/3] overflow-hidden bg-gray-100 relative">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center">
                      <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg opacity-0 group-hover:opacity-100 transition">
                        Start Reading
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg line-clamp-2">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                    <div className="text-xs text-muted-foreground mt-2">
                      <p>Due: {book.return_date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}