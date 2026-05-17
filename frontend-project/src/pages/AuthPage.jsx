import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        await login(form);
        navigate("/cars");
      } else {
        await register(form);
        setIsLogin(true);
        setError("Account created! You can now log in.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-md">CWSMS</h1>
          <p className="text-indigo-200 mt-2">Car Washing Sales Management System</p>
        </div>

        <Card className="!p-8">
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Username"
              value={form.username}
              onChange={(v) => setForm({ ...form, username: v })}
            />
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(v) => setForm({ ...form, password: v })}
            />
            
            {error && (
              <div className={`p-3 rounded-lg text-sm font-medium ${error.includes("created") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                {error}
              </div>
            )}

            <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 mt-2">
              {isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
