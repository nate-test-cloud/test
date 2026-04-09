import DashboardSidebar from "@/components/DashboardSidebar";
import TopSearchBar from "@/components/TopSearchBar";
import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";

const initialCart = [
  { id: 1, title: "1984", price: 299 },
  { id: 2, title: "Dune", price: 499 },
];

export default function Purchase() {
  const [cart, setCart] = useState(initialCart);

  const removeItem = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const total = cart.reduce((acc, item) => acc + item.price, 0);

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
          <h1 className="text-2xl font-bold mb-6">My Purchases</h1>

          {cart.length === 0 ? (
            <p className="text-muted-foreground">Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
                >
                  <div>
                    <h2 className="font-semibold">{item.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      ₹{item.price}
                    </p>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <div className="flex justify-between items-center mt-6">
                <h2 className="text-lg font-semibold">Total</h2>
                <span className="font-bold text-xl">₹{total}</span>
              </div>

              <button className="w-full bg-[#926d24] text-white py-2 rounded-lg mt-4 hover:bg-[#6d4f13]" >
                Checkout
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}