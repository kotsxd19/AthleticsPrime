// src/pages/Dashboard.jsx
import PageHeader from '../components/shared/PageHeader';
import ChartCarousel from '../components/dashboard/ChartCarousel';
import MetricsGrid from '../components/dashboard/MetricsGrid'

export default function Dashboard() {
    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

            <PageHeader
                title="Dashboard"
                subtitle="Resumen general de tu tienda online"
                badge="Última semana"
            />

            <ChartCarousel />

            <MetricsGrid />

        </main>
    );
}