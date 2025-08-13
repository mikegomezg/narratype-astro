import React, { useEffect, useMemo, useState } from 'react';

type LibraryItem = {
    filename: string;
    displayPath: string;
    title: string;
    author?: string;
    difficulty?: string;
    category?: string;
    wordCount: number;
    inDatabase?: boolean;
    lastPracticed?: string | null;
    timesPracticed?: number;
    id?: number | null;
    isFavorite?: boolean;
};

export function TextLibrary(): JSX.Element {
    const [items, setItems] = useState<LibraryItem[]>([]);
    const [filter, setFilter] = useState<{ category: string | null; difficulty: string | null }>({ category: null, difficulty: null });

    useEffect(() => {
        (async () => {
            const res = await fetch('/api/texts');
            const data = await res.json();
            setItems(data.items ?? []);
        })();
    }, []);

    const filtered = useMemo(() => {
        return items.filter((it) => (filter.category ? it.category === filter.category : true) && (filter.difficulty ? it.difficulty === filter.difficulty : true));
    }, [items, filter]);

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
                <select className="rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-sm" value={filter.category ?? ''} onChange={(e) => setFilter((f) => ({ ...f, category: e.target.value || null }))}>
                    <option value="">All Categories</option>
                    {Array.from(new Set(items.map((i) => i.category).filter(Boolean))).map((c) => (
                        <option key={c} value={c!}>{c}</option>
                    ))}
                </select>
                <select className="rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-sm" value={filter.difficulty ?? ''} onChange={(e) => setFilter((f) => ({ ...f, difficulty: e.target.value || null }))}>
                    <option value="">All Difficulty</option>
                    {Array.from(new Set(items.map((i) => i.difficulty).filter(Boolean))).map((d) => (
                        <option key={d} value={d!}>{d}</option>
                    ))}
                </select>
            </div>

            <ul className="divide-y divide-neutral-800">
                {filtered.map((it) => (
                    <li key={it.filename} className="flex items-center justify-between gap-3 py-3">
                        <div className="min-w-0">
                            <div className="truncate font-medium">
                                {it.title}
                                {it.inDatabase ? null : <span className="ml-2 rounded bg-neutral-800 px-2 py-0.5 text-xs text-neutral-300">file only</span>}
                            </div>
                            <div className="truncate text-sm text-neutral-400">{it.displayPath}</div>
                            <div className="text-xs text-neutral-500">{it.author || 'Unknown'} • {it.wordCount} words • {it.category || 'Uncategorized'} • {it.difficulty || 'Unrated'}</div>
                            {it.timesPracticed ? <div className="text-xs text-green-500">Practiced {it.timesPracticed}x</div> : null}
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                            <button
                                className={`text-xl ${it.isFavorite ? 'text-amber-500' : 'text-neutral-600 hover:text-neutral-400'}`}
                                disabled={!it.id}
                                onClick={async () => {
                                    if (!it.id) return;
                                    await fetch(`/api/texts/${it.id}/favorite`, { method: 'POST' });
                                    setItems((prev) => prev.map((x) => (x.filename === it.filename ? { ...x, isFavorite: !x.isFavorite } : x)));
                                }}
                                title={it.isFavorite ? 'Unfavorite' : 'Favorite'}
                            >
                                {it.isFavorite ? '★' : '☆'}
                            </button>
                            <button className="btn-secondary" onClick={async () => {
                                const resp = await fetch('/api/exercises/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sourcePath: it.filename }) });
                                const data = await resp.json();
                                try { localStorage.setItem('narratype:lastPractice', JSON.stringify(data)); } catch { }
                                window.location.href = '/';
                            }}>Practice</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}


