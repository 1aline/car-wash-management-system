import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

const pages = ["Car", "Packages", "ServicePackage", "Payment", "Reports"];

function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [activePage, setActivePage] = useState("Car");
  const [message, setMessage] = useState("");

  const [cars, setCars] = useState([]);
  const [packages, setPackages] = useState([]);
  const [records, setRecords] = useState([]);

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ username: "", password: "" });
  const [carForm, setCarForm] = useState({
    plateNumber: "",
    carType: "",
    carSize: "",
    driverName: "",
    phoneNumber: "",
  });
  const [packageForm, setPackageForm] = useState({
    packageNumber: "",
    packageName: "",
    packageDescription: "",
    packagePrice: "",
  });
  const [recordForm, setRecordForm] = useState({
    recordNumber: "",
    serviceDate: "",
    car: "",
    package: "",
  });
  const [paymentForm, setPaymentForm] = useState({
    paymentNumber: "",
    amountPaid: "",
    paymentDate: "",
    serviceRecord: "",
  });
  const [editingRecordId, setEditingRecordId] = useState("");
  const [reportDate, setReportDate] = useState(new Date().toISOString().slice(0, 10));
  const [dailyReport, setDailyReport] = useState([]);
  const [selectedBillRecordId, setSelectedBillRecordId] = useState("");
  const [bill, setBill] = useState(null);

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3500);
  };

  const loadCoreData = async () => {
    const [carsRes, packagesRes, recordsRes] = await Promise.all([
      api.get("/cars"),
      api.get("/packages"),
      api.get("/service-records"),
    ]);
    setCars(carsRes.data);
    setPackages(packagesRes.data);
    setRecords(recordsRes.data);
  };

  const checkSession = async () => {
    const res = await api.get("/auth/me");
    setUser(res.data.user);
    if (res.data.user) {
      await loadCoreData();
    }
  };

  useEffect(() => {
    checkSession().catch(() => setUser(null));
  }, []);

  const recordOptions = useMemo(
    () => records.map((r) => ({ id: r._id, label: `${r.recordNumber} - ${r.car?.plateNumber || ""}` })),
    [records]
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/login", loginForm);
      await checkSession();
      setLoginForm({ username: "", password: "" });
      showMessage("Login successful.");
    } catch (error) {
      showMessage(error.response?.data?.message || "Login failed.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", registerForm);
      setRegisterForm({ username: "", password: "" });
      setAuthMode("login");
      showMessage("Account created. Please login.");
    } catch (error) {
      showMessage(error.response?.data?.message || "Registration failed.");
    }
  };

  const handleLogout = async () => {
    await api.post("/auth/logout");
    setUser(null);
    setBill(null);
    showMessage("Logged out.");
  };

  const createCar = async (e) => {
    e.preventDefault();
    try {
      await api.post("/cars", carForm);
      setCarForm({ plateNumber: "", carType: "", carSize: "", driverName: "", phoneNumber: "" });
      await loadCoreData();
      showMessage("Car saved.");
    } catch (error) {
      showMessage(error.response?.data?.message || "Could not save car.");
    }
  };

  const createPackage = async (e) => {
    e.preventDefault();
    try {
      await api.post("/packages", { ...packageForm, packagePrice: Number(packageForm.packagePrice) });
      setPackageForm({ packageNumber: "", packageName: "", packageDescription: "", packagePrice: "" });
      await loadCoreData();
      showMessage("Package saved.");
    } catch (error) {
      showMessage(error.response?.data?.message || "Could not save package.");
    }
  };

  const submitRecord = async (e) => {
    e.preventDefault();
    const payload = { ...recordForm, serviceDate: new Date(recordForm.serviceDate).toISOString() };
    try {
      if (editingRecordId) {
        await api.put(`/service-records/${editingRecordId}`, payload);
        showMessage("Service record updated.");
      } else {
        await api.post("/service-records", payload);
        showMessage("Service record inserted.");
      }
      setEditingRecordId("");
      setRecordForm({ recordNumber: "", serviceDate: "", car: "", package: "" });
      await loadCoreData();
    } catch (error) {
      showMessage(error.response?.data?.message || "Could not save service record.");
    }
  };

  const editRecord = (record) => {
    setEditingRecordId(record._id);
    setActivePage("ServicePackage");
    setRecordForm({
      recordNumber: record.recordNumber,
      serviceDate: new Date(record.serviceDate).toISOString().slice(0, 10),
      car: record.car?._id || "",
      package: record.package?._id || "",
    });
  };

  const deleteRecord = async (id) => {
    try {
      await api.delete(`/service-records/${id}`);
      await loadCoreData();
      showMessage("Service record deleted.");
    } catch (error) {
      showMessage(error.response?.data?.message || "Could not delete.");
    }
  };

  const createPayment = async (e) => {
    e.preventDefault();
    try {
      await api.post("/payments", {
        ...paymentForm,
        amountPaid: Number(paymentForm.amountPaid),
        paymentDate: new Date(paymentForm.paymentDate).toISOString(),
      });
      setPaymentForm({ paymentNumber: "", amountPaid: "", paymentDate: "", serviceRecord: "" });
      await loadCoreData();
      showMessage("Payment saved.");
    } catch (error) {
      showMessage(error.response?.data?.message || "Could not save payment.");
    }
  };

  const fetchDailyReport = async () => {
    const res = await api.get(`/reports/daily?date=${reportDate}`);
    setDailyReport(res.data);
  };

  const fetchBill = async () => {
    if (!selectedBillRecordId) return;
    const res = await api.get(`/bills/${selectedBillRecordId}`);
    setBill(res.data);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <form
          onSubmit={authMode === "login" ? handleLogin : handleRegister}
          className="bg-white p-6 rounded-xl shadow-md w-full max-w-md"
        >
          <h1 className="text-2xl font-bold mb-4 text-center">
            {authMode === "login" ? "CWSMS Login" : "CWSMS Register"}
          </h1>
          <Input
            label="Username"
            value={authMode === "login" ? loginForm.username : registerForm.username}
            onChange={(v) =>
              authMode === "login"
                ? setLoginForm({ ...loginForm, username: v })
                : setRegisterForm({ ...registerForm, username: v })
            }
          />
          <Input
            label="Password"
            type="password"
            value={authMode === "login" ? loginForm.password : registerForm.password}
            onChange={(v) =>
              authMode === "login"
                ? setLoginForm({ ...loginForm, password: v })
                : setRegisterForm({ ...registerForm, password: v })
            }
          />
          <button className="w-full bg-blue-700 text-white py-2 rounded-md mt-2">
            {authMode === "login" ? "Login" : "Register"}
          </button>
          {message && <p className="mt-3 text-sm text-center text-blue-700">{message}</p>}
          <button
            type="button"
            className="w-full text-sm text-blue-700 underline mt-3"
            onClick={() => {
              setAuthMode(authMode === "login" ? "register" : "login");
              setMessage("");
            }}
          >
            {authMode === "login"
              ? "No account? Create one"
              : "Already have an account? Login"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-slate-900 text-white p-4">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-2 items-center justify-between">
          <h1 className="font-bold">Car Washing Sales Management System</h1>
          <nav className="flex gap-2 flex-wrap">
            {pages.map((p) => (
              <button
                key={p}
                onClick={() => setActivePage(p)}
                className={`px-3 py-1 rounded ${activePage === p ? "bg-blue-600" : "bg-slate-700"}`}
              >
                {p}
              </button>
            ))}
            <button onClick={handleLogout} className="px-3 py-1 rounded bg-red-600">
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-4">
        {message && <div className="bg-blue-100 border border-blue-300 text-blue-800 px-3 py-2 rounded">{message}</div>}

        {activePage === "Car" && (
          <Card title="Car Form ">
            <form onSubmit={createCar} className="grid md:grid-cols-2 gap-3">
              <Input label="Plate Number" value={carForm.plateNumber} onChange={(v) => setCarForm({ ...carForm, plateNumber: v })} />
              <Input label="Car Type" value={carForm.carType} onChange={(v) => setCarForm({ ...carForm, carType: v })} />
              <Input label="Car Size" value={carForm.carSize} onChange={(v) => setCarForm({ ...carForm, carSize: v })} />
              <Input label="Driver Name" value={carForm.driverName} onChange={(v) => setCarForm({ ...carForm, driverName: v })} />
              <Input label="Phone Number" value={carForm.phoneNumber} onChange={(v) => setCarForm({ ...carForm, phoneNumber: v })} />
              <button className="bg-blue-700 text-white rounded px-4 py-2 md:col-span-2">Save Car</button>
            </form>
          </Card>
        )}

        {activePage === "Packages" && (
          <Card title="Package Form ">
            <form onSubmit={createPackage} className="grid md:grid-cols-2 gap-3">
              <Input label="Package Number" value={packageForm.packageNumber} onChange={(v) => setPackageForm({ ...packageForm, packageNumber: v })} />
              <Input label="Package Name" value={packageForm.packageName} onChange={(v) => setPackageForm({ ...packageForm, packageName: v })} />
              <Input
                label="Package Description"
                value={packageForm.packageDescription}
                onChange={(v) => setPackageForm({ ...packageForm, packageDescription: v })}
              />
              <Input
                label="Package Price"
                type="number"
                value={packageForm.packagePrice}
                onChange={(v) => setPackageForm({ ...packageForm, packagePrice: v })}
              />
              <button className="bg-blue-700 text-white rounded px-4 py-2 md:col-span-2">Save Package</button>
            </form>
            <p className="text-sm text-gray-600 mt-3">Default packages are auto-inserted from backend on startup.</p>
          </Card>
        )}

        {activePage === "ServicePackage" && (
          <Card title="Service Record Form (Insert / Update / Delete / Retrieve)">
            <form onSubmit={submitRecord} className="grid md:grid-cols-2 gap-3">
              <Input
                label="Record Number"
                value={recordForm.recordNumber}
                onChange={(v) => setRecordForm({ ...recordForm, recordNumber: v })}
              />
              <Input
                label="Service Date"
                type="date"
                value={recordForm.serviceDate}
                onChange={(v) => setRecordForm({ ...recordForm, serviceDate: v })}
              />
              <Select
                label="Car"
                value={recordForm.car}
                onChange={(v) => setRecordForm({ ...recordForm, car: v })}
                options={cars.map((c) => ({ id: c._id, label: `${c.plateNumber} - ${c.driverName}` }))}
              />
              <Select
                label="Package"
                value={recordForm.package}
                onChange={(v) => setRecordForm({ ...recordForm, package: v })}
                options={packages.map((p) => ({ id: p._id, label: `${p.packageName} (${p.packagePrice} RWF)` }))}
              />
              <div className="md:col-span-2 flex gap-2">
                <button className="bg-blue-700 text-white rounded px-4 py-2">
                  {editingRecordId ? "Update Record" : "Save Record"}
                </button>
                {editingRecordId && (
                  <button
                    type="button"
                    className="bg-gray-500 text-white rounded px-4 py-2"
                    onClick={() => {
                      setEditingRecordId("");
                      setRecordForm({ recordNumber: "", serviceDate: "", car: "", package: "" });
                    }}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>

            <div className="mt-4 overflow-auto">
              <table className="w-full text-sm border">
                <thead className="bg-slate-200">
                  <tr>
                    <th className="p-2 border">Record</th>
                    <th className="p-2 border">Date</th>
                    <th className="p-2 border">Plate</th>
                    <th className="p-2 border">Package</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r) => (
                    <tr key={r._id}>
                      <td className="p-2 border">{r.recordNumber}</td>
                      <td className="p-2 border">{new Date(r.serviceDate).toLocaleDateString()}</td>
                      <td className="p-2 border">{r.car?.plateNumber}</td>
                      <td className="p-2 border">{r.package?.packageName}</td>
                      <td className="p-2 border space-x-2">
                        <button onClick={() => editRecord(r)} className="bg-amber-500 text-white px-2 py-1 rounded">
                          Edit
                        </button>
                        <button onClick={() => deleteRecord(r._id)} className="bg-red-600 text-white px-2 py-1 rounded">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {activePage === "Payment" && (
          <Card title="Payment Form ">
            <form onSubmit={createPayment} className="grid md:grid-cols-2 gap-3">
              <Input label="Payment Number" value={paymentForm.paymentNumber} onChange={(v) => setPaymentForm({ ...paymentForm, paymentNumber: v })} />
              <Input label="Amount Paid (RWF)" type="number" value={paymentForm.amountPaid} onChange={(v) => setPaymentForm({ ...paymentForm, amountPaid: v })} />
              <Input label="Payment Date" type="date" value={paymentForm.paymentDate} onChange={(v) => setPaymentForm({ ...paymentForm, paymentDate: v })} />
              <Select label="Service Record" value={paymentForm.serviceRecord} onChange={(v) => setPaymentForm({ ...paymentForm, serviceRecord: v })} options={recordOptions} />
              <button className="bg-blue-700 text-white rounded px-4 py-2 md:col-span-2">Save Payment</button>
            </form>
          </Card>
        )}

        {activePage === "Reports" && (
          <Card title="Reports (Bill + Daily report)">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded p-3 bg-white">
                <h3 className="font-semibold mb-2">Generate Bill</h3>
                <Select label="Service Record" value={selectedBillRecordId} onChange={setSelectedBillRecordId} options={recordOptions} />
                <button onClick={fetchBill} className="bg-blue-700 text-white rounded px-4 py-2 mt-2">
                  Generate Bill
                </button>
                {bill && (
                  <div className="mt-3 text-sm bg-slate-50 border rounded p-3 space-y-1">
                    <p><strong>Record:</strong> {bill.recordNumber}</p>
                    <p><strong>Plate:</strong> {bill.plateNumber}</p>
                    <p><strong>Driver:</strong> {bill.driverName}</p>
                    <p><strong>Package:</strong> {bill.packageName}</p>
                    <p><strong>Description:</strong> {bill.packageDescription}</p>
                    <p><strong>Package Price:</strong> {bill.packagePrice} RWF</p>
                    <p><strong>Amount Paid:</strong> {bill.amountPaid} RWF</p>
                    <p><strong>Balance:</strong> {bill.balance} RWF</p>
                  </div>
                )}
              </div>

              <div className="border rounded p-3 bg-white">
                <h3 className="font-semibold mb-2">Daily Report</h3>
                <Input label="Date" type="date" value={reportDate} onChange={setReportDate} />
                <button onClick={fetchDailyReport} className="bg-blue-700 text-white rounded px-4 py-2 mt-2">
                  Load Report
                </button>
                <div className="mt-3 overflow-auto">
                  <table className="w-full text-sm border">
                    <thead className="bg-slate-200">
                      <tr>
                        <th className="p-2 border">PlateNumber</th>
                        <th className="p-2 border">PackageName</th>
                        <th className="p-2 border">PackageDescription</th>
                        <th className="p-2 border">AmountPaid</th>
                        <th className="p-2 border">PaymentDate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dailyReport.map((row, idx) => (
                        <tr key={idx}>
                          <td className="p-2 border">{row.plateNumber}</td>
                          <td className="p-2 border">{row.packageName}</td>
                          <td className="p-2 border">{row.packageDescription}</td>
                          <td className="p-2 border">{row.amountPaid}</td>
                          <td className="p-2 border">{new Date(row.paymentDate).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <section className="bg-white shadow rounded-xl p-4">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      {children}
    </section>
  );
}

function Input({ label, value, onChange, type = "text" }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium">{label}</span>
      <input
        className="border border-slate-300 rounded px-3 py-2"
        type={type}
        value={value}
        required
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium">{label}</span>
      <select
        className="border border-slate-300 rounded px-3 py-2"
        value={value}
        required
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select option</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default App;
