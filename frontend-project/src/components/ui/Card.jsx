export function Card({ title, children, className = "" }) {
  return (
    <section className={`bg-white/80 backdrop-blur-md shadow-xl border border-slate-100 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl ${className}`}>
      {title && <h2 className="text-xl font-bold text-slate-800 mb-5">{title}</h2>}
      {children}
    </section>
  );
}
