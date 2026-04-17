import DashboardSidebar from "@/components/DashboardSidebar";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  /* Check Login Cookie */
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

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email) {
      setMessage("Please fill all required fields");
      return;
    }

    setMessage("Settings updated successfully!");
  };

  return (
    <div className="min-h-screen bg-background relative">
      <DashboardSidebar />

      <div className="lg:ml-[272px] relative z-10">

        <main className="p-6 max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Settings</h1>

          {/* Profile Card */}
          <div className="bg-white p-6 rounded-xl shadow space-y-5">
            
            {/* Name */}
            <div>
              <label className="block text-sm text-muted-foreground mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#926d24]"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-muted-foreground mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#926d24]"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-muted-foreground mb-1">
                New Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter new password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#926d24]"
              />
            </div>

            {/* Message */}
            {message && (
              <p className="text-sm text-green-600">{message}</p>
            )}

            {/* Button */}
            <button
              onClick={handleSave}
              className="w-full bg-[#926d24] text-white py-2 rounded-lg hover:bg-[#6d4f13] transition-all duration-200"
            >
              Save Changes
            </button>
          </div>

          {/* Extra Section */}
          <div className="mt-8 bg-white p-6 rounded-xl shadow">
            <h2 className="text-lg font-semibold mb-3">Account Actions</h2>

            <button className="text-red-500 hover:underline text-sm">
              Delete Account
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}