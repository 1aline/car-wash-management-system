import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { path: "/cars", label: "Cars", icon: "🚗" },
  { path: "/packages", label: "Packages", icon: "📦" },
  { path: "/service-records", label: "Service Records", icon: "📋" },
  { path: "/payments", label: "Payments", icon: "💳" },
  { path: "/reports", label: "Reports", icon: "📊" },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white flex flex-col hidden md:flex shadow-2xl z-10">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight">CWSMS</h1>
          <p className="text-indigo-300 text-sm mt-1">Management System</p>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md transform scale-105"
                    : "text-indigo-200 hover:bg-indigo-800 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 mt-auto">
          <div className="bg-indigo-800 rounded-xl p-4 flex flex-col gap-3">
            <div className="text-sm">
              <p className="text-indigo-300">Logged in as</p>
              <p className="font-semibold truncate">{user?.username}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 transition-colors rounded-lg text-sm font-semibold shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-indigo-900 text-white p-4 flex justify-between items-center shadow-md">
          <h1 className="text-xl font-bold">CWSMS</h1>
          <button onClick={handleLogout} className="text-sm bg-red-500 px-3 py-1 rounded">Logout</button>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
