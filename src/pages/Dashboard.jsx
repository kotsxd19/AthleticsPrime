// src/pages/Dashboard.jsx
import React from 'react';
import useDashboard from '../hooks/useDashboard';
import PageHeader from '../components/shared/PageHeader';
import ChartCarousel from '../components/dashboard/ChartCarousel';
import MetricsGrid from '../components/dashboard/MetricsGrid';

export default function Dashboard() {
    const { loading, error, stats, charts, global, topProducts, refetch } = useDashboard();

    if (loading) {
        return (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex flex-col items-center justify-center min-h-[60vh]">
                <div className="flex flex-col items-center gap-3">
                    <i className="fa-solid fa-spinner fa-spin text-4xl text-indigo-600" />
                    <p className="text-slate-500 font-semibold animate-pulse">Cargando Dashboard en tiempo real...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-4 max-w-md mx-auto mt-12">
                    <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto text-xl">
                        <i className="fa-solid fa-circle-exclamation" />
                    </div>
                    <div>
                        <h3 className="font-bold text-red-800 text-lg">Error al cargar datos</h3>
                        <p className="text-red-600 text-sm mt-1">{error}</p>
                    </div>
                    <button
                        onClick={refetch}
                        className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition cursor-pointer"
                    >
                        Intentar de nuevo
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <PageHeader
                    title="Dashboard"
                    subtitle="Resumen general de tu tienda online"
                    badge="En tiempo real"
                />
                <button
                    onClick={refetch}
                    className="self-start sm:self-auto px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition flex items-center gap-2 shadow-sm cursor-pointer"
                    title="Actualizar datos ahora"
                >
                    <i className="fa-solid fa-arrows-rotate" />
                    Actualizar
                </button>
            </div>

            {/* Gráficos en Carrusel */}
            <ChartCarousel charts={charts} />

            {/* Cuadrícula de Tarjetas de Métricas (6 cards) */}
            <MetricsGrid stats={stats} />

            {/* Sección Extra: Métricas Globales y Top Vendidos */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                {/* Resumen Global */}
                <div className="bg-white rounded-2xl p-6 shadow-sm shadow-slate-200/60 border border-slate-100 flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg">Resumen Global</h3>
                        <p className="text-slate-500 text-sm mt-1">Ventas e ingresos acumulados históricos del negocio.</p>
                    </div>

                    <div className="space-y-4 my-6">
                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg shrink-0">
                                <i className="fa-solid fa-coins" />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Ventas Totales Históricas</p>
                                <p className="text-xl font-bold text-slate-800 mt-0.5">
                                    ${global.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0">
                                <i className="fa-solid fa-clipboard-list" />
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Pedidos Registrados</p>
                                <p className="text-xl font-bold text-slate-800 mt-0.5">
                                    {global.totalOrders} {global.totalOrders === 1 ? 'pedido' : 'pedidos'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className="text-xs text-slate-400 italic">
                        * Métricas sincronizadas dinámicamente con la base de datos de MongoDB Atlas.
                    </p>
                </div>

                {/* Productos Más Vendidos */}
                <div className="bg-white rounded-2xl p-6 shadow-sm shadow-slate-200/60 border border-slate-100 lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg">Productos Más Vendidos</h3>
                            <p className="text-slate-500 text-sm mt-1">Los 5 artículos con mayor número de unidades vendidas.</p>
                        </div>
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-50 text-amber-700 border border-amber-100">
                            Top 5
                        </span>
                    </div>

                    {topProducts.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-slate-500">
                            Aún no se registran artículos vendidos en los pedidos concretados.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
                                    <tr className="text-left">
                                        <th className="px-4 py-3 font-semibold">Nombre</th>
                                        <th className="px-4 py-3 font-semibold">Categoría</th>
                                        <th className="px-4 py-3 font-semibold">Precio Unitario</th>
                                        <th className="px-4 py-3 font-semibold text-right">Cant. Vendida</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {topProducts.map((p, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 transition">
                                            <td className="px-4 py-3.5 font-semibold text-slate-800">{p.name}</td>
                                            <td className="px-4 py-3.5 text-slate-500">
                                                <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                                                    p.category === 'Ropa'
                                                        ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                                                        : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                }`}>
                                                    {p.category}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 text-slate-600">
                                                ${p.price?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-4 py-3.5 text-right font-bold text-slate-900">{p.salesCount} uds</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

        </main>
    );
}