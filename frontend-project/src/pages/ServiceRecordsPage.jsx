import { useState, useEffect, useMemo } from "react";
import { api } from "../api";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";

export default function ServiceRecordsPage() {
  const [records, setRecords] = useState([]);
  const [cars, setCars] = useState([]);
  const [packages, setPackages] = useState([]);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState("");

  const [form, setForm] = useState({ serviceDate: "", car: "", package: "" });

  const loadData = async () => {
    try {
      const [recRes, carRes, pkgRes] = await Promise.all([
        api.get("/service-records"),
        api.get("/cars"),
        api.get("/packages"),
      ]);
      setRecords(recRes.data);
      setCars(carRes.data);
      setPackages(pkgRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, serviceDate: new Date(form.serviceDate).toISOString() };
      if (editingId) {
        await api.put(`/service-records/${editingId}`, payload);
        setMessage("Record updated successfully!");
      } else {
        await api.post("/service-records", payload);
        setMessage("Record saved successfully!");
      }
      setEditingId("");
      setForm({ serviceDate: "", car: "", package: "" });
      loadData();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not save record.");
    }
  };

  const handleEdit = (r) => {
    setEditingId(r._id);
    setForm({
      serviceDate: r.serviceDate ? new Date(r.serviceDate).toISOString().slice(0, 10) : "",
      car: r.car?._id || "",
      package: r.package?._id || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    try {
      await api.delete(`/service-records/${id}`);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Service Records</h1>
        <p className="text-slate-500 mt-1">Log and manage car washing services.</p>
      </div>

      <Card title={editingId ? "Edit Service Record" : "Add Service Record"}>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Service Date" type="date" value={form.serviceDate} onChange={(v) => setForm({ ...form, serviceDate: v })} />
          
          <Select 
            label="Car" 
            value={form.car} 
            onChange={(v) => setForm({ ...form, car: v })}
            options={cars.map(c => ({ id: c._id, label: `${c.plateNumber} - ${c.driverName}` }))}
          />
          <Select 
            label="Package" 
            value={form.package} 
            onChange={(v) => setForm({ ...form, package: v })}
            options={packages.map(p => ({ id: p._id, label: `${p.packageName} (${p.packagePrice} RWF)` }))}
          />
          
          <div className="md:col-span-2 flex items-center gap-3 mt-2">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-md transition-all">
              {editingId ? "Update Record" : "Save Record"}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={() => { setEditingId(""); setForm({ serviceDate: "", car: "", package: "" }); }}
                className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2.5 px-6 rounded-lg transition-all"
              >
                Cancel
              </button>
            )}
            {message && <span className="text-sm font-medium text-emerald-600">{message}</span>}
          </div>
        </form>
      </Card>

      <Card title="History">
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-100 text-slate-600 uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Record No.</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Plate</th>
                <th className="px-6 py-4">Package</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {records.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No records found.</td>
                </tr>
              ) : (
                records.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">{r.recordNumber}</td>
                    <td className="px-6 py-4">{new Date(r.serviceDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium text-indigo-600">{r.car?.plateNumber || "N/A"}</td>
                    <td className="px-6 py-4">{r.package?.packageName || "N/A"}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => handleEdit(r)} className="text-amber-500 hover:text-amber-700 font-semibold px-2">Edit</button>
                      <button onClick={() => handleDelete(r._id)} className="text-red-500 hover:text-red-700 font-semibold px-2">Delete</button>
                    </td>
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
