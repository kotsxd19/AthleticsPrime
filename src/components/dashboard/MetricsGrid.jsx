// src/components/MetricsGrid.jsx
import MetricCard from '../shared/MetricCard';
import { metricsData } from '../../data/metrics';

export default function MetricsGrid() {
    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {metricsData.map(card => (
                <MetricCard key={card.id} {...card} />
            ))}
        </section>
    );
}