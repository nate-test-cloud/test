import DashboardSidebar from "@/components/DashboardSidebar";
import TopSearchBar from "@/components/TopSearchBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, ShoppingCart } from "lucide-react";

export default function Purchase() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const cartRes = await fetch("http://localhost:5000/api/v1/cart", {
        method: "GET",
        credentials: "include",
      });

      if (cartRes.ok) {
        const data = await cartRes.json();
        setCartItems(data);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/v1/verify", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          navigate("/login");
          return;
        }

        await fetchCart();
      } catch {
        navigate("/login");
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleRemoveItem = async (cartItemId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/cart/${cartItemId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setCartItems(cartItems.filter((item) => item.id !== cartItemId));
      }
    } catch (error) {
      alert("Error removing item from cart");
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/v1/cart/checkout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        alert("Purchase successful!");
        setCartItems([]);
        setTimeout(() => {
          navigate("/issued");
        }, 500);
      } else {
        const data = await res.json();
        alert(data.message);
      }
    } catch (error) {
      alert("Error processing checkout");
    }
  };

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Checking authentication...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading cart...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <DashboardSidebar />

      <div className="lg:ml-[272px] relative z-10">
        <TopSearchBar />

        <main className="p-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <ShoppingCart className="h-8 w-8" />
            Shopping Cart
          </h1>
          <p className="text-muted-foreground mb-6">
            {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in cart
          </p>

          {cartItems.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-12 text-center">
              <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-lg text-muted-foreground mb-4">Your cart is empty</p>
              <button
                onClick={() => navigate("/index")}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow p-4 flex gap-4 items-start"
                  >
                    <img
                      src={item.cover}
                      alt={item.title}
                      className="w-16 h-24 object-cover rounded"
                    />

                    <div className="flex-grow">
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">by {item.author}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Quantity: {item.quantity}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                          item.purchase_type === "ebook"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}>
                          {item.purchase_type === "ebook" ? "Borrow eBook (14 days)" : "Purchase Physical"}
                        </span>
                      </div>
                      <p className="text-sm font-semibold mt-2">
                        ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition flex-shrink-0"
                      title="Remove from cart"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-xl shadow p-6 h-fit sticky top-24">
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 pb-6 border-b">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="space-y-1"
                    >
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">
                          {item.title} × {item.quantity}
                        </span>
                        <span className="font-semibold">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          item.mode === "online"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}>
                          {item.mode === "online" ? "Borrow" : "Purchase"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotal */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>₹0</span>
                  </div>
                </div>

                {/* Total */}
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-bold text-primary">₹{total}</span>
                  </div>
                </div>

                {/* Availability Warning */}
                {cartItems.some((item) => item.quantity > item.available_copies) && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700">
                    ⚠️ Some items have reduced availability
                  </div>
                )}

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                  className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => navigate("/index")}
                  className="w-full py-2 px-4 mt-2 border border-border rounded-lg font-semibold hover:bg-secondary transition"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}