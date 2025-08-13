import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { calculateAccuracy, calculateWpm } from '@/lib/metrics';

type Exercise = {
    id: string;
    type: string;
    content: string;
    lesson: number;
    sequence: number;
};

type SessionState = {
    startedAt: number | null;
    endedAt: number | null;
    input: string;
    position: number;
    errors: number;
    charactersTyped: number;
    completed: boolean;
};

export function TypingPractice(): JSX.Element {
    const [exercise, setExercise] = useState<Exercise | null>(null);
    const [textId, setTextId] = useState<number | null>(null);
    const [available, setAvailable] = useState<Array<{ filename: string; title: string }>>([]);
    const [selectedPath, setSelectedPath] = useState<string | null>(null);
    const [state, setState] = useState<SessionState>({
        startedAt: null,
        endedAt: null,
        input: '',
        position: 0,
        errors: 0,
        charactersTyped: 0,
        completed: false
    });

    const inputRef = useRef<HTMLInputElement>(null);

    // Load available texts and a selected lesson from localStorage or generate a fallback
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('/api/texts');
                const data = await res.json();
                const items: Array<{ filename: string; title: string }> = (data.items || []).map((i: any) => ({ filename: i.filename, title: i.title }));
                setAvailable(items);
            } catch { }

            try {
                const cached = localStorage.getItem('narratype:lastPractice');
                if (cached) {
                    const parsed = JSON.parse(cached);
                    const first = parsed?.lessons?.[0]?.items?.[0];
                    if (first) {
                        setExercise(first);
                        if (parsed.textId) setTextId(parsed.textId);
                        return;
                    }
                }
            } catch { }

            try {
                const lastSelected = localStorage.getItem('narratype:lastSelectedFile');
                if (lastSelected) {
                    const resp = await fetch('/api/exercises/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sourcePath: lastSelected }) });
                    const data = await resp.json();
                    const first = data?.lessons?.[0]?.items?.[0];
                    if (first) {
                        setExercise(first);
                        if (data?.textId) setTextId(data.textId);
                        setSelectedPath(lastSelected);
                        try { localStorage.setItem('narratype:lastPractice', JSON.stringify(data)); } catch { }
                        return;
                    }
                }
            } catch { }
        } catch { }

        const res2 = await fetch('/api/exercises/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fallback: true })
        });
        const data2 = await res2.json();
        const first2 = data2?.lessons?.[0]?.items?.[0];
        if (first2) setExercise(first2);
        if (data2?.textId) setTextId(data2.textId);
    })();
}, []);

useEffect(() => {
    inputRef.current?.focus();
}, [exercise]);

const onKey = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!exercise) return;
        if (state.completed) return;
        if (e.key === 'Escape') {
            e.preventDefault();
            reset();
            return;
        }
        if (e.key.length === 1 || e.key === 'Backspace') {
            e.preventDefault();
        }

        setState((prev) => {
            let { input, position, errors, charactersTyped, startedAt } = prev;
            const target = exercise.content;

            if (!startedAt) startedAt = Date.now();

            if (e.key === 'Backspace') {
                if (position > 0) {
                    position -= 1;
                    const prevChar = input[input.length - 1];
                    input = input.slice(0, -1);
                    if (prevChar !== target[position]) {
                        errors = Math.max(0, errors - 1);
                    }
                    charactersTyped = Math.max(0, charactersTyped - 1);
                }
            } else if (e.key.length === 1) {
                const ch = e.key;
                input += ch;
                if (target[position] !== ch) errors += 1;
                position += 1;
                charactersTyped += 1;
            }

            const completed = position >= target.length;
            const endedAt = completed ? Date.now() : null;
            return { ...prev, input, position, errors, charactersTyped, startedAt, endedAt, completed };
        });
    },
    [exercise, state.completed]
);

const reset = useCallback(() => {
    setState({ startedAt: null, endedAt: null, input: '', position: 0, errors: 0, charactersTyped: 0, completed: false });
    inputRef.current?.focus();
}, []);

const metrics = useMemo(() => {
    const elapsed = (state.endedAt ?? Date.now()) - (state.startedAt ?? Date.now());
    const correct = Math.max(0, state.charactersTyped - state.errors);
    return {
        wpm: calculateWpm(state.charactersTyped, state.startedAt ? elapsed : 0),
        accuracy: calculateAccuracy(correct, Math.max(1, state.charactersTyped)),
        errors: state.errors,
        elapsedMs: state.startedAt ? elapsed : 0
    };
}, [state]);

const renderText = () => {
    if (!exercise) return null;
    const target = exercise.content;
    const typed = state.input;
    const cursor = state.position;
    const correct = typed.split('').map((ch, i) => ch === target[i]);

    return (
        <div className="space-y-3">
            <div className="text-xs text-neutral-400">{exercise.id} • {exercise.type}</div>
            <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4 font-mono text-lg leading-7">
                {target.split('').map((ch, i) => {
                    let cls = '';
                    if (i < typed.length) cls = correct[i] ? 'text-green-400' : 'text-red-400';
                    else if (i === cursor) cls = 'bg-brand-700 text-white rounded-sm';
                    else cls = 'text-neutral-400';
                    return (
                        <span key={i} className={cls}>
                            {ch === ' ' ? '\u00A0' : ch}
                        </span>
                    );
                })}
            </div>
        </div>
    );
};

// Persist session when completed
useEffect(() => {
    if (!exercise) return;
    if (!state.completed) return;
    if (!state.startedAt || !state.endedAt) return;
    (async () => {
        try {
            await fetch('/api/sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text_id: textId,
                    started_at: new Date(state.startedAt).toISOString(),
                    ended_at: new Date(state.endedAt).toISOString(),
                    exercise_type: exercise.type,
                    lesson_number: exercise.lesson,
                    exercise_number: exercise.sequence,
                    wpm: metrics.wpm,
                    accuracy: metrics.accuracy,
                    characters_typed: state.charactersTyped,
                    errors: state.errors,
                    completed: true
                })
            });
        } catch { }
    })();
}, [state.completed]);

return (
    <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
            <select
                className="rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-sm"
                value={selectedPath ?? ''}
                onChange={async (e) => {
                    const path = e.target.value || null;
                    setSelectedPath(path);
                    if (!path) return;
                    const resp = await fetch('/api/exercises/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sourcePath: path }) });
                    const data = await resp.json();
                    const first = data?.lessons?.[0]?.items?.[0];
                    if (first) setExercise(first);
                    if (data?.textId) setTextId(data.textId);
                    try {
                        localStorage.setItem('narratype:lastSelectedFile', path);
                        localStorage.setItem('narratype:lastPractice', JSON.stringify(data));
                    } catch { }
                    reset();
                }}
            >
                <option value="">Select text...</option>
                {available.map((it) => (
                    <option key={it.filename} value={it.filename}>{it.title}</option>
                ))}
            </select>
            <button className="btn-secondary" onClick={reset}>Restart (Esc)</button>
        </div>
        {renderText()}
        {/* Hidden input to capture keystrokes */}
        <input
            ref={inputRef}
            value=""
            onChange={() => { }}
            onKeyDown={onKey}
            className="h-0 w-0 opacity-0"
            aria-label="hidden typing input"
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Metric label="WPM" value={metrics.wpm.toFixed(1)} />
            <Metric label="Accuracy" value={`${metrics.accuracy.toFixed(1)}%`} />
            <Metric label="Errors" value={`${metrics.errors}`} />
            <Metric label="Time" value={`${Math.floor(metrics.elapsedMs / 1000)}s`} />
        </div>
    </div>
);
}

function Metric(props: { label: string; value: string }) {
    return (
        <div className="rounded-md border border-neutral-800 bg-neutral-900/60 p-3 text-center">
            <div className="text-xs uppercase tracking-wider text-neutral-400">{props.label}</div>
            <div className="text-xl font-semibold">{props.value}</div>
        </div>
    );
}


