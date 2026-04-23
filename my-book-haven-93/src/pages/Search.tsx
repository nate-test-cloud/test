import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import DashboardSidebar from "@/components/DashboardSidebar";
import TopSearchBar from "@/components/TopSearchBar";
import BookCard from "@/components/BookCard";

const Search = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
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

        if (query) {
          const searchRes = await fetch(`http://localhost:5000/api/v1/books/search/${encodeURIComponent(query)}`, {
            method: "GET",
            credentials: "include",
          });

          if (searchRes.ok) {
            const data = await searchRes.json();
            setBooks(data);
          }
        }

        setLoading(false);
      } catch {
        navigate("/login");
      }
    };

    fetchData();
  }, [query]);

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
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground font-serif">
              Search Results
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {query ? `Results for "${query}"` : "Enter a search term"}
            </p>
          </div>
          {books.length === 0 ? (
            <p className="text-muted-foreground">
              {query ? "No books found matching your search." : "Start typing to search for books..."}
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
              {books.map((book) => (
                <BookCard key={book.id} {...book} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Search;