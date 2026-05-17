import { useState, useEffect } from "react";
import { api } from "../api";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({ amountPaid: "", paymentDate: "", serviceRecord: "" });
  const [message, setMessage] = useState("");

  const loadData = async () => {
    try {
      const [payRes, recRes] = await Promise.all([
        api.get("/payments"),
        api.get("/service-records")
      ]);
      setPayments(payRes.data);
      setRecords(recRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/payments", {
        ...form,
        amountPaid: Number(form.amountPaid),
        paymentDate: new Date(form.paymentDate).toISOString()
      });
      setMessage("Payment saved successfully!");
      setForm({ amountPaid: "", paymentDate: "", serviceRecord: "" });
      loadData();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Could not save payment.");
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Payments</h1>
        <p className="text-slate-500 mt-1">Record payments for service records.</p>
      </div>

      <Card title="Add Payment">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Amount Paid (RWF)" type="number" value={form.amountPaid} onChange={(v) => setForm({ ...form, amountPaid: v })} />
          <Input label="Payment Date" type="date" value={form.paymentDate} onChange={(v) => setForm({ ...form, paymentDate: v })} />
          
          <Select 
            label="Service Record" 
            value={form.serviceRecord} 
            onChange={(v) => setForm({ ...form, serviceRecord: v })}
            options={records.map(r => ({ id: r._id, label: `${r.recordNumber} - ${r.car?.plateNumber || "Unknown"}` }))}
          />
          
          <div className="md:col-span-2 flex items-end">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-md transition-all">
              Save Payment
            </button>
            {message && <span className="ml-4 text-sm font-medium text-emerald-600">{message}</span>}
          </div>
        </form>
      </Card>

      <Card title="Recent Payments">
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-100 text-slate-600 uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Payment No.</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Amount Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-slate-500">No payments found.</td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">{p.paymentNumber}</td>
                    <td className="px-6 py-4">{new Date(p.paymentDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-bold text-emerald-600">{p.amountPaid} RWF</td>
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
