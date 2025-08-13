import React, { useEffect, useMemo, useState } from "react";

export interface RecentTextsGridProps {
    sortBy?: "author" | "recent" | "progress";
}

type UiText = {
    id: number | null;
    filename: string;
    title: string;
    author: string;
    category?: string;
    difficulty?: string;
    wordCount: number;
    excerpt?: string;
    lastPracticed: string | null;
    timesPracticed: number;
    isFavorite: boolean;
};

export function RecentTextsGrid({ sortBy = "author" }: RecentTextsGridProps): React.JSX.Element {
    const [texts, setTexts] = useState<UiText[]>([]);

    useEffect(() => {
        (async () => {
            const res = await fetch('/api/texts');
            const data = await res.json();
            const items: UiText[] = (data.items || []).map((i: any) => ({
                id: i.id ?? null,
                filename: i.displayPath,
                title: i.title,
                author: i.author || 'Unknown',
                category: i.category,
                difficulty: i.difficulty,
                wordCount: i.wordCount ?? 0,
                excerpt: undefined,
                lastPracticed: i.lastPracticed ?? null,
                timesPracticed: i.timesPracticed ?? 0,
                isFavorite: Boolean(i.isFavorite)
            }));
            setTexts(items);
        })();
    }, []);

    const sortedTexts = useMemo(() => {
        const copy = [...texts];
        switch (sortBy) {
            case "author":
                return copy.sort((a, b) => a.author.localeCompare(b.author) || a.title.localeCompare(b.title));
            case "recent":
                return copy.sort((a, b) => (new Date(b.lastPracticed || 0).getTime()) - (new Date(a.lastPracticed || 0).getTime()));
            case "progress":
                // Placeholder until we have real progress per text
                return copy;
            default:
                return copy;
        }
    }, [sortBy, texts]);

    const groupedTexts = useMemo(() => {
        if (sortBy !== "author") return { "": sortedTexts } as Record<string, UiText[]>;
        return sortedTexts.reduce((acc, text) => {
            if (!acc[text.author]) acc[text.author] = [];
            acc[text.author].push(text);
            return acc;
        }, {} as Record<string, UiText[]>);
    }, [sortedTexts, sortBy]);

    const toggleFavorite = async (textId: number | null, e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!textId) return;
        await fetch(`/api/texts/${textId}/favorite`, { method: 'POST' });
        setTexts((prev) => prev.map((t) => (t.id === textId ? { ...t, isFavorite: !t.isFavorite } : t)));
    };

    return (
        <div className="space-y-6">
            {Object.entries(groupedTexts).map(([author, texts]) => (
                <div key={author || "ungrouped"}>
                    {author && sortBy === "author" && (
                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-400">
                            {author}
                        </h3>
                    )}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {texts.map((text) => (
                            <div
                                key={text.id}
                                className="card p-4 transition-colors hover:border-neutral-700"
                            >
                                <div className="mb-3 flex items-start justify-between">
                                    <div className="flex-1">
                                        <h4 className="mb-1 font-semibold">{text.title}</h4>
                                        <p className="text-sm text-neutral-400">{text.author}</p>
                                    </div>
                                    <button
                                        onClick={(e) => toggleFavorite(text.id, e)}
                                        className={`text-xl transition-colors ${text.isFavorite
                                            ? "text-amber-500"
                                            : "text-neutral-600 hover:text-neutral-400"
                                            }`}
                                    >
                                        {text.isFavorite ? "★" : "☆"}
                                    </button>
                                </div>

                                <p className="mb-3 line-clamp-2 text-sm text-neutral-500">
                                    {text.excerpt}
                                </p>

                                <div className="mb-3 flex items-center justify-between">
                                    <div className="flex gap-3 text-xs">
                                        <span className="text-neutral-500">{text.wordCount} words</span>
                                        <span
                                            className={`rounded px-2 py-0.5 ${text.difficulty === "Easy"
                                                ? "bg-green-900/50 text-green-400"
                                                : text.difficulty === "Medium"
                                                    ? "bg-amber-900/50 text-amber-400"
                                                    : "bg-red-900/50 text-red-400"
                                                }`}
                                        >
                                            {text.difficulty}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-t border-neutral-800 pt-3">
                                    <div className="flex gap-3 text-sm text-neutral-500">
                                        <span>{text.wordCount} words</span>
                                        {text.timesPracticed > 0 && <span>Practiced {text.timesPracticed}x</span>}
                                    </div>
                                    <div className="text-xs text-neutral-500" />
                                </div>

                                <div className="mt-3 flex gap-2">
                                    <a
                                        href={text.id ? `/practice?textId=${text.id}&mode=guided` : '/texts'}
                                        className="btn-primary flex-1 text-center text-sm"
                                    >
                                        Continue
                                    </a>
                                    <a
                                        href={text.id ? `/practice?textId=${text.id}&mode=free` : '/texts'}
                                        className="btn-secondary flex-1 text-center text-sm"
                                    >
                                        Free Practice
                                    </a>
                                </div>

                                <div className="mt-2 text-xs text-neutral-600">
                                    Last practiced: {text.lastPracticed ? new Date(text.lastPracticed).toLocaleDateString() : 'Never'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}


