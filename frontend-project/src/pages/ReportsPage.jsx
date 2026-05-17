import { useState, useEffect } from "react";
import { api } from "../api";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";

export default function ReportsPage() {
  const [records, setRecords] = useState([]);
  const [selectedRecordId, setSelectedRecordId] = useState("");
  const [bill, setBill] = useState(null);

  const [reportDate, setReportDate] = useState(new Date().toISOString().slice(0, 10));
  const [dailyReport, setDailyReport] = useState([]);

  useEffect(() => {
    api.get("/service-records").then(res => setRecords(res.data)).catch(console.error);
  }, []);

  const generateBill = async () => {
    if (!selectedRecordId) return;
    try {
      const res = await api.get(`/bills/${selectedRecordId}`);
      setBill(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDailyReport = async () => {
    try {
      const res = await api.get(`/reports/daily?date=${reportDate}`);
      setDailyReport(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Reports & Billing</h1>
        <p className="text-slate-500 mt-1">Generate individual bills or view daily income.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Generate Customer Bill" className="flex flex-col">
          <div className="space-y-4 flex-1">
            <Select 
              label="Select Service Record" 
              value={selectedRecordId} 
              onChange={setSelectedRecordId}
              options={records.map(r => ({ id: r._id, label: `${r.recordNumber} - ${r.car?.plateNumber || "Unknown"}` }))}
            />
            <button 
              onClick={generateBill} 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-lg shadow-md transition-all"
            >
              Generate Bill
            </button>

            {bill && (
              <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-end border-b border-slate-200 pb-3 mb-3">
                  <h3 className="font-bold text-lg text-slate-800">Invoice</h3>
                  <span className="text-sm font-semibold text-slate-500">Record: {bill.recordNumber}</span>
                </div>
                
                <div className="space-y-2 text-sm text-slate-700 mb-4">
                  <p><span className="font-semibold w-24 inline-block">Plate:</span> {bill.plateNumber}</p>
                  <p><span className="font-semibold w-24 inline-block">Driver:</span> {bill.driverName}</p>
                  <p><span className="font-semibold w-24 inline-block">Package:</span> <span className="font-medium text-indigo-700">{bill.packageName}</span></p>
                  <p className="text-xs text-slate-500 italic pl-24 mb-2">{bill.packageDescription}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-600">Package Price</span>
                    <span>{bill.packagePrice} RWF</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-600">Amount Paid</span>
                    <span className="text-emerald-600">{bill.amountPaid} RWF</span>
                  </div>
                  <div className="border-t border-dashed border-slate-200 my-2 pt-2 flex justify-between font-bold text-lg">
                    <span className="text-slate-800">Balance Due</span>
                    <span className={bill.balance > 0 ? "text-red-600" : "text-slate-800"}>{bill.balance} RWF</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card title="Daily Income Report" className="flex flex-col">
          <div className="space-y-4 flex-1">
            <Input 
              label="Select Date" 
              type="date" 
              value={reportDate} 
              onChange={setReportDate} 
            />
            <button 
              onClick={fetchDailyReport} 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-lg shadow-md transition-all"
            >
              Load Report
            </button>

            {dailyReport.length > 0 ? (
              <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-100 text-slate-600 font-semibold">
                    <tr>
                      <th className="px-4 py-3">Plate</th>
                      <th className="px-4 py-3">Package</th>
                      <th className="px-4 py-3">Paid</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {dailyReport.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-800">{row.plateNumber}</td>
                        <td className="px-4 py-3">{row.packageName}</td>
                        <td className="px-4 py-3 font-bold text-emerald-600">{row.amountPaid} RWF</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50 font-bold text-slate-800 border-t-2 border-slate-200">
                      <td colSpan="2" className="px-4 py-3 text-right">Total:</td>
                      <td className="px-4 py-3 text-emerald-700">
                        {dailyReport.reduce((sum, row) => sum + row.amountPaid, 0)} RWF
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
               <div className="mt-6 p-4 text-center text-sm text-slate-500 border border-dashed border-slate-300 rounded-lg bg-slate-50">
                 Generate a report to see daily income.
               </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
