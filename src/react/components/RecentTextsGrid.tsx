import React, { useMemo } from "react";
import { sampleTexts, TextMetadata } from "@/react/data/sampleTexts";

export interface RecentTextsGridProps {
    sortBy?: "author" | "recent" | "progress";
}

export function RecentTextsGrid({ sortBy = "author" }: RecentTextsGridProps): React.JSX.Element {
    const sortedTexts = useMemo(() => {
        const texts = [...sampleTexts];
        switch (sortBy) {
            case "author":
                return texts.sort((a, b) => {
                    const authorCompare = a.author.localeCompare(b.author);
                    if (authorCompare !== 0) return authorCompare;
                    return a.title.localeCompare(b.title);
                });
            case "recent":
                return texts.sort(
                    (a, b) =>
                        new Date(b.lastPracticed).getTime() -
                        new Date(a.lastPracticed).getTime(),
                );
            case "progress":
                return texts.sort((a, b) => b.progress - a.progress);
            default:
                return texts;
        }
    }, [sortBy]);

    const groupedTexts = useMemo(() => {
        if (sortBy !== "author") return { "": sortedTexts } as Record<string, TextMetadata[]>;
        return sortedTexts.reduce((acc, text) => {
            if (!acc[text.author]) acc[text.author] = [];
            acc[text.author].push(text);
            return acc;
        }, {} as Record<string, TextMetadata[]>);
    }, [sortedTexts, sortBy]);

    const toggleFavorite = (textId: string, e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        // Placeholder: integrate with persistence later
        console.log("Toggle favorite for:", textId);
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
                                    <div className="flex gap-3 text-sm">
                                        <span className="text-green-500">{text.wpm} WPM</span>
                                        <span className="text-blue-500">{text.accuracy}%</span>
                                    </div>
                                    <div className="text-xs text-neutral-500">
                                        {text.progress}% complete
                                    </div>
                                </div>

                                <div className="mt-3 flex gap-2">
                                    <a
                                        href={`/practice?textId=${text.id}&mode=guided`}
                                        className="btn-primary flex-1 text-center text-sm"
                                    >
                                        Continue
                                    </a>
                                    <a
                                        href={`/practice?textId=${text.id}&mode=free`}
                                        className="btn-secondary flex-1 text-center text-sm"
                                    >
                                        Free Practice
                                    </a>
                                </div>

                                <div className="mt-2 text-xs text-neutral-600">
                                    Last practiced: {new Date(text.lastPracticed).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}


