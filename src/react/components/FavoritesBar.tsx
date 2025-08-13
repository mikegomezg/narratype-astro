import React, { useEffect, useState } from "react";

type FavoriteItem = {
    id: number | null;
    title: string;
    author?: string;
    difficulty?: string;
};

export function FavoritesBar(): React.JSX.Element {
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch('/api/texts?favorites=true');
                const data = await res.json();
                const items = (data.items || []).map((i: any) => ({ id: i.id, title: i.title, author: i.author, difficulty: i.difficulty }));
                setFavorites(items);
            } catch {
                setFavorites([]);
            }
        })();
    }, []);

    if (favorites.length === 0) {
        return (
            <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-neutral-700">
                <p className="text-neutral-500">
                    No favorites yet. Star texts you want quick access to!
                </p>
            </div>
        );
    }

    return (
        <div className="flex gap-3 overflow-x-auto pb-2">
            {favorites.map((text) => (
                <a
                    key={text.id ?? text.title}
                    href={text.id ? `/practice?textId=${text.id}` : '/texts'}
                    className="card min-w-[200px] flex-shrink-0 p-3 transition-colors hover:border-amber-500/50"
                >
                    <div className="mb-2 flex items-start justify-between">
                        <span className="text-amber-500">★</span>
                        <div className="text-xs text-neutral-500">{text.difficulty}</div>
                    </div>
                    <h3 className="mb-1 line-clamp-1 text-sm font-semibold">{text.title}</h3>
                    <p className="text-xs text-neutral-400">{text.author}</p>
                    <div className="mt-2 flex items-center gap-2 text-xs">
                        <span className="text-green-500">{text.wpm} WPM</span>
                        <span className="text-neutral-600">•</span>
                        <span className="text-blue-500">{text.accuracy}%</span>
                    </div>
                </a>
            ))}
        </div>
    );
}


