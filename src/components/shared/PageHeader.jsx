// src/components/PageHeader.jsx

export default function PageHeader({ title, subtitle, badge }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-slate-500 text-sm mt-1">{subtitle}</p>
                )}
            </div>

            {badge && (
                <div className="flex items-center gap-2 text-sm text-slate-500 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm">
                    <i className="fa-regular fa-calendar text-slate-400" />
                    <span>{badge}</span>
                </div>
            )}
        </div>
    );
}