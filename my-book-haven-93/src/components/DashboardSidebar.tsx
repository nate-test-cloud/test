import {
  LayoutDashboard,
  BookOpen,
  BookCheck,
  Clock,
  Monitor,
  ShoppingCart,
  Settings,
  LogOut,
  ChevronRight,
  Bell,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";

const mainItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/index" },
  { icon: BookCheck, label: "Issued Books", to: "/issued" },
  { icon: Clock, label: "Return Deadlines", to: "/return-deadline" },
  { icon: Monitor, label: "Online Reading", to: "/online-read" },
  { icon: ShoppingCart, label: "My Purchases", to: "/purchase" },
  { icon: Bell, label: "Notifications", to: "/notifications" },
];

const toolItems = [
  { icon: Settings, label: "Settings", to: "/settings" },
];

const DashboardSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        credentials: "include",
      });
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/login");
    }
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[272px] bg-card border-r border-border/60 flex flex-col z-30 max-lg:hidden">
      {/* Logo */}
      <div className="px-6 pt-7 pb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/20">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <span className="font-bold text-lg text-foreground tracking-tight leading-none">
              BookShelf
            </span>
          </div>
        </div>
      </div>

      <Separator className="mx-5 w-auto" />

      {/* Main Nav */}
      <nav className="flex-1 px-4 pt-5 space-y-0.5 overflow-y-auto">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-3">
          Menu
        </p>
        {mainItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 relative text-muted-foreground hover:bg-secondary hover:text-foreground"
            activeClassName="bg-primary text-primary-foreground shadow-md shadow-primary/25"
          >
            <div className="flex items-center justify-center h-8 w-8 rounded-lg transition-all duration-200 group-hover:bg-primary/10">
              <item.icon className="h-[18px] w-[18px]" />
            </div>

            <span className="flex-1 text-left">{item.label}</span>

            <ChevronRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-50 group-hover:translate-x-0 transition-all duration-200" />
          </NavLink>
))}

        <div className="pt-6" />
        <Separator className="mx-2 w-auto mb-4" />
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-3">
          Tools
        </p>

        {toolItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 relative text-muted-foreground hover:bg-secondary hover:text-foreground"
            activeClassName="bg-primary text-primary-foreground shadow-md shadow-primary/25"
          >
            <div className="flex items-center justify-center h-8 w-8 rounded-lg transition-all duration-200 group-hover:bg-primary/10">
              <item.icon className="h-[18px] w-[18px]" />
            </div>

            <span className="flex-1 text-left">{item.label}</span>

            <ChevronRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-50 group-hover:translate-x-0 transition-all duration-200" />
          </NavLink>
        ))}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 relative text-muted-foreground hover:bg-secondary hover:text-foreground mt-2"
        >
          <div className="flex items-center justify-center h-8 w-8 rounded-lg transition-all duration-200 group-hover:bg-primary/10">
            <LogOut className="h-[18px] w-[18px]" />
          </div>

          <span className="flex-1 text-left">Logout</span>

          <ChevronRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-50 group-hover:translate-x-0 transition-all duration-200" />
        </button>
      </nav>

    </aside>
  );
};

export default DashboardSidebar;
