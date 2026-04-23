import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardSidebar from "@/components/DashboardSidebar";
import TopSearchBar from "@/components/TopSearchBar";
import BookCard from "@/components/BookCard";
import bookstoreBanner from "@/assets/bookstore-banner.jpg";

const Index = () => {
  const [books, setBooks] = useState([]);
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

        // Fetch books
        const booksRes = await fetch("http://localhost:5000/api/v1/books", {
          method: "GET",
          credentials: "include",
        });

        if (booksRes.ok) {
          const booksData = await booksRes.json();
          setBooks(booksData);
        }

        setLoading(false);
      } catch {
        navigate("/login");
      }
    };

    verifyUser();
  }, []);

  // Prevent render until verified
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <img
        src={bookstoreBanner}
        alt=""
        className="fixed inset-0 w-full h-full object-cover opacity-[0.07] pointer-events-none z-0"
      />
      <DashboardSidebar />
      <div className="lg:ml-[272px] relative z-10">
        <TopSearchBar />
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground font-serif">For You</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Recommended based on your reading history
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
            {books.map((book) => (
              <BookCard key={book.id} {...book} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;