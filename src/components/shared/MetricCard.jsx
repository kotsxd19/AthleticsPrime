export default function MetricCard({ title, value, change, trend, icon, iconBg, iconColor }) {

  const trendStyle = {
    up:      'text-emerald-600',
    down:    'text-rose-600',
    neutral: 'text-slate-400',
  }[trend] ?? 'text-slate-400';

  const trendIcon = {
    up:      'fa-arrow-up',
    down:    'fa-arrow-down',
    neutral: null,
  }[trend];

  return (
    <article className="metric-card bg-white rounded-2xl p-6 shadow-sm shadow-slate-200/60 border border-slate-100">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg} ${iconColor}`}>
          <i className={`fa-solid ${icon} text-sm`} />
        </div>
      </div>

      <p className="text-3xl font-bold mt-3 tracking-tight">{value}</p>

      <p className={`text-xs font-semibold mt-2 flex items-center gap-1 ${trendStyle}`}>
        {trendIcon && <i className={`fa-solid ${trendIcon}`} />}
        {change}
      </p>

      <a href="#" className="text-sm text-slate-500 hover:text-slate-900 mt-4 inline-flex items-center gap-1 transition">
        Ver más <span aria-hidden="true">→</span>
      </a>
    </article>
  );
}