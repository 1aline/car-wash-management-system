export function Select({ label, value, onChange, options, required = true }) {
  return (
    <label className="flex flex-col gap-1.5 w-full">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <select
        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm appearance-none cursor-pointer"
        value={value}
        required={required}
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
