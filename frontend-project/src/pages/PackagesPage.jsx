import { useState, useEffect } from "react";
import { api } from "../api";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [form, setForm] = useState({ packageName: "", packageDescription: "", packagePrice: "" });
  const [message, setMessage] = useState("");

  const loadPackages = async () => {
    try {
      const res = await api.get("/packages");
      setPackages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadPackages(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/packages", { ...form, packagePrice: Number(form.packagePrice) });
      setMessage("Package saved successfully!");
      setForm({ packageName: "", packageDescription: "", packagePrice: "" });
      loadPackages();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not save package.");
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Service Packages</h1>
        <p className="text-slate-500 mt-1">Manage your custom washing packages.</p>
      </div>

      <Card title="Add New Package">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Package Name" value={form.packageName} onChange={(v) => setForm({ ...form, packageName: v })} />
          <Input label="Package Description" value={form.packageDescription} onChange={(v) => setForm({ ...form, packageDescription: v })} />
          <Input label="Package Price (RWF)" type="number" value={form.packagePrice} onChange={(v) => setForm({ ...form, packagePrice: v })} />
          
          <div className="md:col-span-2 flex items-end">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-md transition-all">
              Save Package
            </button>
            {message && <span className="ml-4 text-sm font-medium text-emerald-600">{message}</span>}
          </div>
        </form>
      </Card>

      <Card title="Available Packages">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {packages.length === 0 ? (
            <p className="text-slate-500 p-4">No packages found.</p>
          ) : (
            packages.map((pkg) => (
              <div key={pkg._id} className="bg-slate-50 border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-slate-800">{pkg.packageName}</h3>
                  <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full font-semibold">
                    {pkg.packagePrice} RWF
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-3">{pkg.packageDescription}</p>
                <div className="text-xs text-slate-400">ID: {pkg.packageNumber}</div>
                {!pkg.user && (
                  <div className="mt-2 text-xs font-semibold text-amber-600">Default (System)</div>
                )}
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
