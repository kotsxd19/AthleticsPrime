// src/components/dashboard/ChartCarousel.jsx
import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { useCarousel } from '../../hooks/useCarousel';

const baseScales = {
    x: { grid: { display: false }, ticks: { color: 'rgba(226,232,240,0.6)', font: { size: 10 } } },
    y: { grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: 'rgba(226,232,240,0.6)', font: { size: 10 } } },
};

const chartTitles = [
    'Ventas mensuales',
    'Ingresos por categoría',
    'Actividad semanal',
    'Estado de pedidos'
];

export default function ChartCarousel({ charts: chartsData }) {
    const { idx, next, prev, jumpTo } = useCarousel(4, 5000);
    const refs = [useRef(), useRef(), useRef(), useRef()];
    const charts = useRef([]);

    useEffect(() => {
        if (!chartsData) return;

        Chart.defaults.color = 'rgba(226,232,240,0.75)';
        Chart.defaults.font.family = "'Inter', sans-serif";
        Chart.defaults.borderColor = 'rgba(255,255,255,0.08)';

        const makeGrad = (ctx, c1, c2) => {
            const g = ctx.createLinearGradient(0, 0, 0, 280);
            g.addColorStop(0, c1); g.addColorStop(1, c2);
            return g;
        };

        const configs = [
            // Chart 1 – Línea ventas
            {
                el: refs[0].current, type: 'line',
                data: {
                    labels: chartsData.ventasMensuales?.labels || [],
                    datasets: [{
                        label: 'Ventas', data: chartsData.ventasMensuales?.data || [],
                        borderColor: '#a5b4fc', fill: true, tension: 0.4,
                        pointBackgroundColor: '#fff', pointRadius: 3, borderWidth: 2.5
                    }]
                },
                extra: (ctx) => ({ backgroundColor: makeGrad(ctx, 'rgba(99,102,241,0.45)', 'rgba(99,102,241,0)') }),
            },
            // Chart 2 – Barras ingresos
            {
                el: refs[1].current, type: 'bar',
                data: {
                    labels: chartsData.ingresosCategoria?.labels || [],
                    datasets: [{
                        label: 'Ingresos', data: chartsData.ingresosCategoria?.data || [],
                        borderRadius: 8, borderSkipped: false, maxBarThickness: 36
                    }]
                },
                extra: (ctx) => ({ backgroundColor: makeGrad(ctx, '#34d399', 'rgba(16,185,129,0.15)') }),
            },
            // Chart 3 – Línea usuarios
            {
                el: refs[2].current, type: 'line',
                data: {
                    labels: chartsData.usuariosSemanales?.labels || [],
                    datasets: [{
                        label: 'Usuarios activos', data: chartsData.usuariosSemanales?.data || [],
                        borderColor: '#fbbf24', fill: true, tension: 0.45,
                        pointBackgroundColor: '#fff', pointRadius: 3, borderWidth: 2.5
                    }]
                },
                extra: (ctx) => ({ backgroundColor: makeGrad(ctx, 'rgba(251,191,36,0.4)', 'rgba(251,191,36,0)') }),
            },
            // Chart 4 – Barras horizontales pedidos
            {
                el: refs[3].current, type: 'bar',
                data: {
                    labels: chartsData.pedidosStatus?.labels || [],
                    datasets: [{
                        label: 'Pedidos', data: chartsData.pedidosStatus?.data || [],
                        backgroundColor: ['#f87171', '#fbbf24', '#34d399'], // Pendiente (red), Proceso (yellow), Finalizado (green)
                        borderRadius: 8, borderSkipped: false, maxBarThickness: 22
                    }]
                },
                options: {
                    indexAxis: 'y',
                    scales: {
                        x: { grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: 'rgba(226,232,240,0.6)', font: { size: 10 } } },
                        y: { grid: { display: false }, ticks: { color: 'rgba(226,232,240,0.7)', font: { size: 11 } } }
                    }
                }
            },
        ];

        // Clean up previous charts to rebuild
        charts.current.forEach(c => c && typeof c.destroy === 'function' && c.destroy());

        charts.current = configs.map(({ el, type, data, extra, options }) => {
            if (!el) return null;
            const ctx = el.getContext('2d');
            if (extra) data.datasets[0] = { ...data.datasets[0], ...extra(ctx) };
            return new Chart(ctx, {
                type,
                data,
                options: {
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: baseScales,
                    ...options,
                },
            });
        }).filter(Boolean);

        return () => {
            charts.current.forEach(c => c && typeof c.destroy === 'function' && c.destroy());
        };
    }, [chartsData]);

    if (!chartsData) {
        return (
            <div className="rounded-3xl p-8 bg-slate-900 border border-slate-800 text-center text-slate-400 h-[380px] flex items-center justify-center">
                <div className="space-y-3">
                    <i className="fa-solid fa-circle-notch fa-spin text-3xl text-indigo-400" />
                    <p>Cargando gráficos analíticos...</p>
                </div>
            </div>
        );
    }

    return (
        <section className="rounded-3xl overflow-hidden shadow-xl shadow-slate-200/70">
            <div className="banner-right p-6 sm:p-8 text-white flex flex-col gap-4">

                {/* Header del carrusel */}
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-xs uppercase tracking-[0.4em] text-slate-400">Analíticas</span>
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight mt-1">
                            {chartTitles[idx]}
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={prev} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center cursor-pointer">
                            <i className="fa-solid fa-chevron-left text-xs" />
                        </button>
                        <button onClick={next} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center cursor-pointer">
                            <i className="fa-solid fa-chevron-right text-xs" />
                        </button>
                    </div>
                </div>

                {/* Pista del carrusel */}
                <div className="overflow-hidden rounded-2xl bg-white/5 border border-white/10">
                    <div
                        style={{ width: '400%', transform: `translateX(-${idx * 25}%)`, transition: 'transform 0.5s ease' }}
                        className="flex"
                    >
                        {refs.map((ref, i) => (
                            <div key={i} className="shrink-0 p-4 h-[320px] sm:h-[380px]" style={{ width: '25%' }}>
                                <canvas ref={ref} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dots */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {chartTitles.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => jumpTo(i)}
                                className={`h-1.5 rounded-full transition-all cursor-pointer ${i === idx ? 'w-8 bg-white' : 'w-2 bg-white/30'
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="text-xs text-slate-400">Auto · 5s</span>
                </div>
            </div>
        </section>
    );
}