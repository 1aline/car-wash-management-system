import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import AuthPage from "./pages/AuthPage";
import CarsPage from "./pages/CarsPage";
import PackagesPage from "./pages/PackagesPage";
import ServiceRecordsPage from "./pages/ServiceRecordsPage";
import PaymentsPage from "./pages/PaymentsPage";
import ReportsPage from "./pages/ReportsPage";

// Protect routes that require a logged-in user
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-indigo-600 font-bold">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// Redirect away from login if already logged in
function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/cars" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PublicRoute><AuthPage /></PublicRoute>} />
          
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/cars" replace />} />
            <Route path="cars" element={<CarsPage />} />
            <Route path="packages" element={<PackagesPage />} />
            <Route path="service-records" element={<ServiceRecordsPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="reports" element={<ReportsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
