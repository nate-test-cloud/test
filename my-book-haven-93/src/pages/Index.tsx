import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardSidebar from "@/components/DashboardSidebar";
import TopSearchBar from "@/components/TopSearchBar";
import BookCard from "@/components/BookCard";
import bookstoreBanner from "@/assets/bookstore-banner.jpg";

import bookGatsby from "@/assets/book-gatsby.jpg";
import book1984 from "@/assets/book-1984.jpg";
import bookMockingbird from "@/assets/book-mockingbird.jpg";
import bookPride from "@/assets/book-pride.jpg";
import bookHobbit from "@/assets/book-hobbit.jpg";
import bookDune from "@/assets/book-dune.jpg";
import bookAlchemist from "@/assets/book-alchemist.jpg";
import bookBrave from "@/assets/book-brave.jpg";

const books = [
  { cover: bookGatsby, title: "The Great Gatsby", author: "F. Scott Fitzgerald", rating: 4 },
  { cover: book1984, title: "1984", author: "George Orwell", rating: 5 },
  { cover: bookMockingbird, title: "To Kill a Mockingbird", author: "Harper Lee", rating: 5 },
  { cover: bookPride, title: "Pride and Prejudice", author: "Jane Austen", rating: 4 },
  { cover: bookHobbit, title: "The Hobbit", author: "J.R.R. Tolkien", rating: 5 },
  { cover: bookDune, title: "Dune", author: "Frank Herbert", rating: 4 },
  { cover: bookAlchemist, title: "The Alchemist", author: "Paulo Coelho", rating: 4 },
  { cover: bookBrave, title: "Brave New World", author: "Aldous Huxley", rating: 3 },
];

const Index = () => {
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
              <BookCard key={book.title} {...book} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;