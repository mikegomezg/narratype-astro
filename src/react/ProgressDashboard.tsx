import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

type ProgressSummary = {
    dates: string[];
    averageWpm: number[];
    averageAccuracy: number[];
    minutes: number[];
};

export function ProgressDashboard(): JSX.Element {
    const [summary, setSummary] = useState<ProgressSummary | null>(null);

    useEffect(() => {
        (async () => {
            const res = await fetch('/api/progress');
            const data = await res.json();
            setSummary(data.summary);
        })();
    }, []);

    if (!summary) return <div className="text-neutral-400">No progress yet. Start practicing!</div>;

    const data = {
        labels: summary.dates,
        datasets: [
            { label: 'Avg WPM', data: summary.averageWpm, borderColor: '#667fff', backgroundColor: 'rgba(102,127,255,0.2)' },
            { label: 'Avg Accuracy %', data: summary.averageAccuracy, borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.2)' }
        ]
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <Stat label="Days" value={`${summary.dates.length}`} />
                <Stat label="Avg WPM (last)" value={`${summary.averageWpm.at(-1) ?? 0}`} />
                <Stat label="Avg Acc (last)" value={`${summary.averageAccuracy.at(-1) ?? 0}%`} />
                <Stat label="Minutes (last)" value={`${summary.minutes.at(-1) ?? 0}`} />
            </div>
            <div className="rounded-md border border-neutral-800 bg-neutral-900/60 p-4">
                <Line data={data} options={{ responsive: true, plugins: { legend: { labels: { color: '#e5e7eb' } } }, scales: { x: { ticks: { color: '#9ca3af' } }, y: { ticks: { color: '#9ca3af' } } } }} />
            </div>
        </div>
    );
}

function Stat(props: { label: string; value: string }) {
    return (
        <div className="rounded-md border border-neutral-800 bg-neutral-900/60 p-3 text-center">
            <div className="text-xs uppercase tracking-wider text-neutral-400">{props.label}</div>
            <div className="text-xl font-semibold">{props.value}</div>
        </div>
    );
}


