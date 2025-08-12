export interface TextMetadata {
    id: string;
    filename: string;
    title: string;
    author: string;
    category: string;
    difficulty: "Easy" | "Medium" | "Hard";
    wordCount: number;
    excerpt: string;
    lastPracticed: string;
    timesPracticed: number;
    progress: number;
    wpm: number;
    accuracy: number;
    isFavorite: boolean;
}

export const sampleTexts: TextMetadata[] = [
    {
        id: "hem-1",
        filename: "texts/classics/hemingway_sun_also_rises.txt",
        title: "The Sun Also Rises - Chapter 1",
        author: "Ernest Hemingway",
        category: "Classic Literature",
        difficulty: "Medium",
        wordCount: 1250,
        excerpt:
            "Robert Cohn was once middleweight boxing champion of Princeton. Do not think that I am very much impressed by that as a boxing title, but it meant a lot to Cohn...",
        lastPracticed: "2024-03-14",
        timesPracticed: 23,
        progress: 65,
        wpm: 52,
        accuracy: 96,
        isFavorite: true,
    },
    {
        id: "hem-2",
        filename: "texts/classics/hemingway_farewell_arms.txt",
        title: "A Farewell to Arms - Opening",
        author: "Ernest Hemingway",
        category: "Classic Literature",
        difficulty: "Medium",
        wordCount: 980,
        excerpt:
            "In the late summer of that year we lived in a house in a village that looked across the river and the plain to the mountains...",
        lastPracticed: "2024-03-10",
        timesPracticed: 15,
        progress: 45,
        wpm: 48,
        accuracy: 94,
        isFavorite: false,
    },
    {
        id: "hem-3",
        filename: "texts/classics/hemingway_old_man_sea.txt",
        title: "The Old Man and the Sea - Part 1",
        author: "Ernest Hemingway",
        category: "Classic Literature",
        difficulty: "Easy",
        wordCount: 850,
        excerpt:
            "He was an old man who fished alone in a skiff in the Gulf Stream and he had gone eighty-four days now without taking a fish...",
        lastPracticed: "2024-03-15",
        timesPracticed: 31,
        progress: 100,
        wpm: 58,
        accuracy: 98,
        isFavorite: true,
    },
    {
        id: "woolf-1",
        filename: "texts/classics/woolf_mrs_dalloway.txt",
        title: "Mrs. Dalloway - Opening",
        author: "Virginia Woolf",
        category: "Classic Literature",
        difficulty: "Hard",
        wordCount: 1450,
        excerpt:
            "Mrs. Dalloway said she would buy the flowers herself. For Lucy had her work cut out for her. The doors would be taken off their hinges...",
        lastPracticed: "2024-03-13",
        timesPracticed: 8,
        progress: 25,
        wpm: 42,
        accuracy: 91,
        isFavorite: false,
    },
    {
        id: "woolf-2",
        filename: "texts/classics/woolf_lighthouse.txt",
        title: "To the Lighthouse - Time Passes",
        author: "Virginia Woolf",
        category: "Classic Literature",
        difficulty: "Hard",
        wordCount: 1680,
        excerpt:
            'Well, we must wait for the future to show," said Mr. Bankes, coming in from the terrace...',
        lastPracticed: "2024-03-08",
        timesPracticed: 5,
        progress: 15,
        wpm: 38,
        accuracy: 89,
        isFavorite: false,
    },
    {
        id: "pal-1",
        filename: "texts/modern/palahniuk_fight_club.txt",
        title: "Fight Club - Chapter 1",
        author: "Chuck Palahniuk",
        category: "Modern Fiction",
        difficulty: "Medium",
        wordCount: 1120,
        excerpt:
            "Tyler gets me a job as a waiter, after that Tyler's pushing a gun in my mouth and saying, the first step to eternal life is you have to die...",
        lastPracticed: "2024-03-15",
        timesPracticed: 19,
        progress: 80,
        wpm: 55,
        accuracy: 95,
        isFavorite: true,
    },
    {
        id: "pal-2",
        filename: "texts/modern/palahniuk_choke.txt",
        title: "Choke - Opening",
        author: "Chuck Palahniuk",
        category: "Modern Fiction",
        difficulty: "Medium",
        wordCount: 950,
        excerpt:
            "If you're going to read this, don't bother. After a couple pages, you won't want to be here. So forget it. Go away. Get out while you're still in one piece...",
        lastPracticed: "2024-03-11",
        timesPracticed: 12,
        progress: 40,
        wpm: 49,
        accuracy: 93,
        isFavorite: false,
    },
    {
        id: "dick-1",
        filename: "texts/scifi/dick_androids_dream.txt",
        title: "Do Androids Dream of Electric Sheep?",
        author: "Philip K. Dick",
        category: "Science Fiction",
        difficulty: "Medium",
        wordCount: 1340,
        excerpt:
            "A merry little surge of electricity piped by automatic alarm from the mood organ beside his bed awakened Rick Deckard...",
        lastPracticed: "2024-03-14",
        timesPracticed: 27,
        progress: 55,
        wpm: 50,
        accuracy: 94,
        isFavorite: true,
    },
    {
        id: "dick-2",
        filename: "texts/scifi/dick_palmer_eldritch.txt",
        title: "The Three Stigmata of Palmer Eldritch",
        author: "Philip K. Dick",
        category: "Science Fiction",
        difficulty: "Hard",
        wordCount: 1560,
        excerpt:
            "His head unnaturally aching, Barney Mayerson woke to find himself in an unfamiliar bedroom in an unfamiliar conapt building...",
        lastPracticed: "2024-03-09",
        timesPracticed: 10,
        progress: 30,
        wpm: 44,
        accuracy: 90,
        isFavorite: false,
    },
    {
        id: "link-1",
        filename: "texts/modern/link_stone_animals.txt",
        title: "Stone Animals",
        author: "Kelly Link",
        category: "Contemporary Fiction",
        difficulty: "Hard",
        wordCount: 1890,
        excerpt:
            "Henry asked a question. He was joking. \"As a matter of fact,\" the real estate agent snapped, \"it is.\" It was not a question she had expected to be asked...",
        lastPracticed: "2024-03-12",
        timesPracticed: 6,
        progress: 20,
        wpm: 41,
        accuracy: 88,
        isFavorite: false,
    },
    {
        id: "cline-1",
        filename: "texts/scifi/cline_ready_player_one.txt",
        title: "Ready Player One - Chapter 1",
        author: "Ernest Cline",
        category: "Science Fiction",
        difficulty: "Easy",
        wordCount: 1080,
        excerpt:
            "My name is Wade Watts. I'm eighteen years old. And it's been forty-four days since the keys went live. Forty-four days, and the leaderboard is still empty...",
        lastPracticed: "2024-03-15",
        timesPracticed: 35,
        progress: 90,
        wpm: 61,
        accuracy: 97,
        isFavorite: true,
    },
    {
        id: "tech-1",
        filename: "texts/technical/javascript_guide.txt",
        title: "JavaScript Fundamentals",
        author: "MDN Web Docs",
        category: "Technical",
        difficulty: "Easy",
        wordCount: 720,
        excerpt:
            "JavaScript is a scripting language that enables you to create dynamically updating content, control multimedia, animate images, and pretty much everything else...",
        lastPracticed: "2024-03-15",
        timesPracticed: 42,
        progress: 100,
        wpm: 63,
        accuracy: 99,
        isFavorite: true,
    },
    {
        id: "tech-2",
        filename: "texts/technical/react_hooks.txt",
        title: "Understanding React Hooks",
        author: "React Documentation",
        category: "Technical",
        difficulty: "Medium",
        wordCount: 920,
        excerpt:
            "Hooks are a new addition in React 16.8. They let you use state and other React features without writing a class...",
        lastPracticed: "2024-03-14",
        timesPracticed: 28,
        progress: 75,
        wpm: 56,
        accuracy: 96,
        isFavorite: false,
    },
    {
        id: "custom-1",
        filename: "texts/custom/personal_notes.txt",
        title: "Meeting Notes - Q1 Review",
        author: "Personal",
        category: "Custom",
        difficulty: "Easy",
        wordCount: 450,
        excerpt:
            "Quarterly review highlights: Team performance exceeded expectations with 15% growth in user engagement...",
        lastPracticed: "2024-03-13",
        timesPracticed: 3,
        progress: 100,
        wpm: 67,
        accuracy: 98,
        isFavorite: false,
    },
];

export function getTextsByAuthor(author: string): TextMetadata[] {
    return sampleTexts.filter((text) => text.author === author);
}

export function getFavoriteTexts(): TextMetadata[] {
    return sampleTexts.filter((text) => text.isFavorite);
}

export function getRecentTexts(limit: number = 5): TextMetadata[] {
    return [...sampleTexts]
        .sort(
            (a, b) =>
                new Date(b.lastPracticed).getTime() -
                new Date(a.lastPracticed).getTime(),
        )
        .slice(0, limit);
}


