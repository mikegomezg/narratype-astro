import React from 'react';

export function MetricsPanel(): JSX.Element {
    // Placeholder showing instructions. In a later phase this will subscribe to session state via context or API.
    return (
        <div className="space-y-2">
            <p className="text-sm text-neutral-300">Metrics update as you type. Restart with Esc.</p>
            <ul className="list-inside list-disc text-sm text-neutral-400">
                <li>WPM: words per minute</li>
                <li>Accuracy: percentage of correct keystrokes</li>
                <li>Errors: number of incorrect keystrokes</li>
                <li>Time: elapsed seconds</li>
            </ul>
        </div>
    );
}


