import { useState, useEffect } from "react";
import { api } from "../api";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";

export default function CarsPage() {
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState({ plateNumber: "", carType: "", carSize: "", driverName: "", phoneNumber: "" });
  const [message, setMessage] = useState("");

  const loadCars = async () => {
    try {
      const res = await api.get("/cars");
      setCars(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadCars(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/cars", form);
      setMessage("Car saved successfully!");
      setForm({ plateNumber: "", carType: "", carSize: "", driverName: "", phoneNumber: "" });
      loadCars();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not save car.");
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Cars</h1>
        <p className="text-slate-500 mt-1">Manage all cars registered by your account.</p>
      </div>

      <Card title="Add New Car">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Input label="Plate Number" value={form.plateNumber} onChange={(v) => setForm({ ...form, plateNumber: v })} />
          <Input label="Car Type" value={form.carType} onChange={(v) => setForm({ ...form, carType: v })} placeholder="e.g. SUV, Sedan" />
          <Input label="Car Size" value={form.carSize} onChange={(v) => setForm({ ...form, carSize: v })} placeholder="e.g. Small, Medium, Large" />
          <Input label="Driver Name" value={form.driverName} onChange={(v) => setForm({ ...form, driverName: v })} />
          <Input label="Phone Number" value={form.phoneNumber} onChange={(v) => setForm({ ...form, phoneNumber: v })} />
          
          <div className="md:col-span-2 lg:col-span-3 flex items-end">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-md transition-all">
              Save Car
            </button>
            {message && <span className="ml-4 text-sm font-medium text-emerald-600">{message}</span>}
          </div>
        </form>
      </Card>

      <Card title="Registered Cars">
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-100 text-slate-600 uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Plate Number</th>
                <th className="px-6 py-4">Type / Size</th>
                <th className="px-6 py-4">Driver</th>
                <th className="px-6 py-4">Phone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {cars.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-500">No cars found. Add one above!</td>
                </tr>
              ) : (
                cars.map((car) => (
                  <tr key={car._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">{car.plateNumber}</td>
                    <td className="px-6 py-4">{car.carType} <span className="text-slate-400">({car.carSize})</span></td>
                    <td className="px-6 py-4">{car.driverName}</td>
                    <td className="px-6 py-4">{car.phoneNumber}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
