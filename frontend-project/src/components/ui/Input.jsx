export function Input({ label, value, onChange, type = "text", required = true, placeholder = "" }) {
  return (
    <label className="flex flex-col gap-1.5 w-full">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <input
        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
