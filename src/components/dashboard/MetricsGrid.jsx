// src/components/dashboard/MetricsGrid.jsx
import MetricCard from '../shared/MetricCard';

export default function MetricsGrid({ stats }) {
    const cards = Array.isArray(stats) ? stats : [];
    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {cards.map(card => (
                <MetricCard key={card.id || card.title} {...card} />
            ))}
        </section>
    );
}